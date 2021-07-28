from app_tutor.func.extension import db
from datetime import datetime, date
from flask_login import UserMixin
from app_tutor import app
import jwt
from time import time
from werkzeug._compat import text_type


class UserMixin(object):

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.email

    # def get_id(self):
    #     try:
    #         return text_type(self.email)
    #     except AttributeError:
    #         raise NotImplementedError('No `id` attribute - override `get_id`')


class Account(UserMixin, db.Model):
    __tablename__ = 'Account'
    email = db.Column(db.String(100), primary_key=True, unique=True)
    password = db.Column(db.String(100))
    username = db.Column(db.String(20))
    phone = db.Column(db.String(11))
    status_tutor = db.Column(db.Boolean)
    status_student = db.Column(db.Boolean)
    status_parents = db.Column(db.Boolean)
    # 2021-07-13 add "personal_question" column.
    personal_question = db.Column(db.String(100))
    # 2021-07-13 add "profile_picture_path" column.
    profile_picture_path = db.Column(db.String(255))
    insert_time = db.Column(db.DateTime, default=datetime.now)
    update_time = db.Column(
        db.DateTime, onupdate=datetime.now, default=datetime.now)

    def __init__(self, email, password, username, phone, status_tutor, status_student, status_parents, personal_question):
        self.email = email
        self.password = password
        self.username = username
        self.phone = phone
        self.status_tutor = status_tutor
        self.status_student = status_student
        self.status_parents = status_parents
        self.personal_question = personal_question

    def get_reset_password_token(self, expires_in=600):
        return jwt.encode(
            {'reset_password': self.email, 'exp': time() + expires_in},
            app.config['SECRET_KEY'], algorithm='HS256')

    @ staticmethod
    def verify_reset_password_token(token):
        try:
            id = jwt.decode(token, app.config['SECRET_KEY'],
                            algorithms=['HS256'])['reset_password']
        except:
            return
        return Account.query.get(id)


class Class(db.Model):
    __tablename__ = 'Class'
    classID = db.Column(db.String(100), primary_key=True,
                        unique=True)
    className = db.Column(db.String(100))
    tutorEmail = db.Column(db.String(100))
    payment_hrs = db.Column(db.Integer)
    payment_time = db.Column(db.Integer)
    url = db.Column(db.String(100))
    insert_time = db.Column(db.DateTime, default=datetime.now)
    update_time = db.Column(
        db.DateTime, onupdate=datetime.now, default=datetime.now)

    def __init__(self, classID, className, tutorEmail, payment_hrs, payment_time, url):
        self.classID = classID
        self.className = className
        self.tutorEmail = tutorEmail
        self.payment_hrs = payment_hrs
        self.payment_time = payment_time
        self.url = url


class Class_Attender(db.Model):
    __tablename__ = 'Class_Attender'
    classattenderID = db.Column(
        db.Integer, primary_key=True, autoincrement=True)
    classID = db.Column(db.String(100))
    attenderEmail = db.Column(db.String(100))
    insert_time = db.Column(db.DateTime, default=datetime.now)
    update_time = db.Column(
        db.DateTime, onupdate=datetime.now, default=datetime.now)

    def __init__(self, classID, attenderEmail):
        self.classID = classID
        self.attenderEmail = attenderEmail


class Class_Time(db.Model):
    __tablename__ = 'Class_Time'
    classtimeID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    classID = db.Column(db.String(100))
    date = db.Column(db.Date)
    weekday = db.Column(db.String(15))
    starttime = db.Column(db.Time)
    endtime = db.Column(db.Time)
    lesson = db.Column(db.String(100))
    hw = db.Column(db.String(100))
    done = db.Column(db.Boolean)  # 2021-07-10 add "done" column.
    insert_time = db.Column(db.DateTime, default=datetime.now)
    update_time = db.Column(
        db.DateTime, onupdate=datetime.now, default=datetime.now)

    def __init__(self, classID, date, weeday, starttime, endtime, lesson, hw, done):
        self.classID = classID
        self.date = date
        self.weekday = weeday
        self.starttime = starttime
        self.endtime = endtime
        self.lesson = lesson
        self.hw = hw
        self.done = done


class Attendance(db.Model):
    __tablename__ = 'Attendance'
    attendanceID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    classID = db.Column(db.String(100))
    date = db.Column(db.Date)
    starttime = db.Column(db.Time)
    endtime = db.Column(db.Time)
    check_tutor = db.Column(db.Boolean)
    check_student = db.Column(db.Boolean)
    check_parents = db.Column(db.Boolean)
    note = db.Column(db.String(100))
    hrs = db.Column(db.Float)
    insert_time = db.Column(db.DateTime, default=datetime.now)
    update_time = db.Column(
        db.DateTime, onupdate=datetime.now, default=datetime.now)

    def __init__(self, classID, date, starttime, endtime, check_tutor, check_student, check_parents, note, hrs):
        self.classID = classID
        self.date = date
        self.starttime = starttime
        self.endtime = endtime
        self.check_tutor = check_tutor
        self.check_student = check_student
        self.check_parents = check_parents
        self.note = note
        self.hrs = hrs


class QA(db.Model):
    __tablename__ = 'QA'
    qaID = db.Column(
        db.Integer, primary_key=True, autoincrement=True)
    classID = db.Column(db.String(100))
    date = db.Column(db.Date)
    question = db.Column(db.String(100))
    reply = db.Column(db.String(100))
    insert_time = db.Column(db.DateTime, default=datetime.now)
    update_time = db.Column(
        db.DateTime, onupdate=datetime.now, default=datetime.now)

    def __init__(self, classID, question, reply):
        self.classID = classID
        self.date = date.today().strftime('%Y-%m-%d')
        self.question = question
        self.reply = reply


# 2021-07-10
# Add "Todolist_Done" table model.
class Todolist_Done(db.Model):
    __tablename__ = 'Todolist_Done'
    origin_classtimeID = db.Column(db.Integer, primary_key=True)
    classID = db.Column(db.String(100))
    date = db.Column(db.Date)
    weekday = db.Column(db.String(15))
    starttime = db.Column(db.Time)
    endtime = db.Column(db.Time)
    lesson = db.Column(db.String(100))
    hw = db.Column(db.String(100))
    insert_time = db.Column(db.DateTime, default=datetime.now)
    update_time = db.Column(
        db.DateTime, onupdate=datetime.now, default=datetime.now)

    def __init__(self, origin_classtimeID, classID, date, weeday, starttime, endtime, lesson, hw):
        self.origin_classtimeID = origin_classtimeID
        self.classID = classID
        self.date = date
        self.weekday = weeday
        self.starttime = starttime
        self.endtime = endtime
        self.lesson = lesson
        self.hw = hw


class Admin(db.Model):
    __tablename__ = 'Admin'
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(80))
    password = db.Column(db.String(100))

    def __init__(self, login, password):
        self.login = login
        self.password = password

    # Flask-Login integration
    # NOTE: is_authenticated, is_active, and is_anonymous
    # are methods in Flask-Login < 0.3.0
    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id

    # Required for administrative interface
    def __unicode__(self):
        return self.username
