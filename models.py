from extension import db
from datetime import datetime


class Account(db.Model):
    __tablename__ = 'Account'
    email = db.Column(db.String(100), primary_key=True, unique=True)
    password = db.Column(db.String(20))
    username = db.Column(db.String(20))
    phone = db.Column(db.String(11))
    status_tutor = db.Column(db.Boolean)
    status_student = db.Column(db.Boolean)
    status_parents = db.Column(db.Boolean)
    insert_time = db.Column(db.DateTime, default=datetime.now)
    update_time = db.Column(
        db.DateTime, onupdate=datetime.now, default=datetime.now)

    def __init__(self, email, password, username, phone, status_tutor, status_student, status_parents):
        self.email = email
        self.password = password
        self.username = username
        self.phone = phone
        self.status_tutor = status_tutor
        self.status_student = status_student
        self.status_parents = status_parents


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
    insert_time = db.Column(db.DateTime, default=datetime.now)
    update_time = db.Column(
        db.DateTime, onupdate=datetime.now, default=datetime.now)

    def __init__(self, classID, date, weeday, starttime, endtime, lesson, hw):
        self.classID = classID
        self.date = date
        self.weekday = weeday
        self.starttime = starttime
        self.endtime = endtime
        self.lesson = lesson
        self.hw = hw


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

    def __init__(self, classID, date, question, reply):
        self.classID = classID
        self.date = date
        self.question = question
        self.reply = reply
