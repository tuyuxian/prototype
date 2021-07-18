import uuid
import secrets
import time
from sqlalchemy.orm import create_session
from models import *
from extension import db, date_calculate, hrs_calculate, get_weekday, time_type, date_type
from flask import Flask, json, render_template, request, jsonify, session, flash, redirect, logging, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from flask_bcrypt import Bcrypt
from datetime import date, timedelta
from distutils.util import strtobool
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_mail import Mail, Message
from flask_cors import CORS
from threading import Thread

# 2021/7/13 更新的部分admin
from wtforms import form, fields, validators
import flask_admin as admin
import flask_login as login
from flask_admin.contrib import sqla
from flask_admin import helpers, expose

# env
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__, static_folder='./static/build', static_url_path='/')
CORS(app)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
db.init_app(app)
bcrypt = Bcrypt(app)
mail = Mail(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.session_protection = "basic"
login_manager.login_view = 'login'
login_manager.login_message = 'Please Login First.'


app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PROT=465,
    MAIL_USE_TLS=True,
    MAIL_DEFAULT_SENDER=('admin', 'xxxxxx@gmail.com'),
    MAIL_USERNAME='xxxxxxx@gmail.com',
    MAIL_PASSWORD='xxxxxxxxx'
)

# 2021/7/13 更新的部分admin, DataBase需要再多新增一個Admin的table,作為管理員帳號管理用

# Define login and registration forms (for flask-login)


class LoginForm(form.Form):
    login = fields.StringField(validators=[validators.required()])
    password = fields.PasswordField(validators=[validators.required()])

    def validate_login(self, field):
        user = self.get_user()
        if user is None:
            raise validators.ValidationError('Invalid user')

        # we're comparing the plaintext pw with the the hash from the db
        if user.password != self.password.data:
            # to compare plain text passwords use
            raise validators.ValidationError('Invalid password')

    def get_user(self):
        return db.session.query(Admin).filter_by(login=self.login.data).first()


class RegistrationForm(form.Form):
    login = fields.StringField(validators=[validators.required()])
    password = fields.PasswordField(validators=[validators.required()])

    def validate_login(self, field):
        if db.session.query(Admin).filter_by(login=self.login.data).count() > 0:
            raise validators.ValidationError('Duplicate username')

# Initialize flask-login


def init_login():
    login_manager = login.LoginManager()
    login_manager.init_app(app)
    # Create user loader function

    @login_manager.user_loader
    def load_user(user_id):
        return db.session.query(Admin).get(user_id)

# Create customized model view class


class MyModelView(sqla.ModelView):
    def is_accessible(self):
        return current_user.is_authenticated

# Create customized index view class that handles login & registration


class MyAdminIndexView(admin.AdminIndexView):
    @expose('/')
    def index(self):
        if not current_user.is_authenticated:
            return redirect(url_for('.login_view'))
        return super(MyAdminIndexView, self).index()

    @expose('/login/', methods=('GET', 'POST'))
    def login_view(self):
        # handle user login
        form = LoginForm(request.form)
        if helpers.validate_form_on_submit(form):
            user = form.get_user()
            login_user(user)

        if current_user.is_authenticated:
            return redirect(url_for('.index'))

        self._template_args['form'] = form

        return super(MyAdminIndexView, self).index()

    @expose('/register/', methods=('GET', 'POST'))
    def register_view(self):
        form = RegistrationForm(request.form)
        if helpers.validate_form_on_submit(form):
            user = Admin()

            form.populate_obj(user)
            # we hash the users password to avoid saving it as plaintext in the db,
            # remove to use plain text:
            user.password = generate_password_hash(form.password.data)
            db.session.add(user)
            db.session.commit()
            login_user(user)
            return redirect(url_for('.index'))

        return super(MyAdminIndexView, self).index()

    @expose('/logout/')
    def logout_view(self):
        logout_user()
        return redirect(url_for('.index'))


# Initialize flask-login
init_login()
# Create admin
admin = admin.Admin(app, 'Tutor', index_view=MyAdminIndexView(),
                    base_template='my_master.html')

# admin.add_view(MyModelView(Account, db.session))
# admin.add_view(MyModelView(Class, db.session))
# admin.add_view(MyModelView(Class_Attender, db.session))
# admin.add_view(MyModelView(Class_Time, db.session))
# admin.add_view(MyModelView(Attendance, db.session))
# admin.add_view(MyModelView(QA, db.session))
# admin.add_view(MyModelView(Todolist_Done, db.session))


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    # if request.method == 'GET':
    #     return jsonify({'status': True})
    if request.method == 'POST':
        # api 1
        data = request.get_json()
        email = data['email']
        username = data['username']
        password = data['password']
        status_tutor = data['status_tutor']
        status_student = data['status_student']
        status_parents = data['status_parents']
        # Add personal_question (2021-07-13)
        personal_question = data['birthday']
        try:
            # Cheking that method is post and form is valid or not.
            check = Account.query.filter_by(email=email).count()
            if check == 0:
                # if all is fine, generate hashed password
                hashed_password = bcrypt.generate_password_hash(
                    password).decode('utf-8')
                # create new user model object
                new_user = Account(
                    email=email,
                    username=username,
                    password=hashed_password,
                    phone=' ',
                    status_tutor=int(status_tutor),
                    status_student=int(status_student),
                    status_parents=int(status_parents),
                    personal_question=personal_question
                )
                # saving user object into data base with hashed password
                db.session.add(new_user)
                db.session.commit()
                flash('You have successfully registered', 'success')
                # if registration successful, then redirecting to login Api
                return jsonify({'status': True})
            else:
                return jsonify({'status': False, 'message': 'This account is already exists.'})
        except:
            return jsonify({'status': False, 'message': 'system error'})


@app.route('/login', methods=['GET', 'POST'])
def login():
    # if request.method == 'GET':
    #     return render_template('login.html')
    if request.method == 'POST':
        # api 2
        data = request.get_json()
        email = data['email']
        password = data['password']
        user_found = Account.query.filter_by(email=email).first()
        try:
            if user_found:
                # if user exist in database than we will compare our database hased password and password come from login form
                if bcrypt.check_password_hash(user_found.password, password):
                    # if password is matched, allow user to access and save email and username inside the session
                    flash('You have successfully logged in.', "success")
                    # session testing
                    # session.permanent -> True，30min expiration
                    session.permanent = True
                    session['logged_in'] = True
                    session['email'] = user_found.email
                    session['name'] = user_found.username
                    session['status_tutor'] = user_found.status_tutor
                    session['status_student'] = user_found.status_student
                    session['status_parents'] = user_found.status_parents

                    # After successful login, redirecting to select status page
                    return jsonify({
                        'status': True,
                        'email': session.get('email'),
                        'status_tutor': session.get('status_tutor'),
                        'status_student': session.get('status_student'),
                        'status_parents': session.get('status_parents')
                    })
                else:
                    # if password is in correct , redirect to login page
                    return jsonify({'status': False, 'message': 'password is wrong'})
            else:
                return jsonify({'status': False, 'message': 'User is not found.'})
        except:
            return jsonify({'status': False, 'message': 'system error'})


@app.route('/logout')
def logout():
    # api 2.1
    # Removing data from session by setting logged_flag to False.
    session['logged_in'] = False
    session.clear()
    # redirecting to home page
    return jsonify({'status': True})


@app.route('/status', methods=['GET', 'POST'])
def status_select():
    # api 3
    # if request.method == 'GET':
    #     email = session.get('email')
    #     status_tutor = session.get('status_tutor')
    #     status_student = session.get('status_student')
    #     status_parents = session.get('status_parents')
    #     return render_template('status.html', status_tutor=status_tutor, status_student=status_student, status_parents=status_parents)

    if request.method == 'POST':
        email = session.get('email')
        user_found = Account.query.filter_by(email=email).first()
        if user_found:
            user_status = request.get_json()['user_status']
            session['user_status'] = int(user_status)
            return jsonify(status=True)
        else:
            return jsonify(status=False, message='User is not found.')


@app.route('/class', methods=['GET'])
def get_class():
    # api 4.1.1
    email = session.get('email')
    # Fix status missing issue (2021-07-14)
    user_status = session.get('user_status')
    if int(user_status) == 1:
        filters_class_tutor = {'tutorEmail': email}
        filters_account = {'email': email}
        query_class = Class.query.filter_by(**filters_class_tutor).all()
        query_account = Account.query.filter_by(**filters_account).first()
        # Add username in session (2021-07-15)
        session['username'] = query_account.username
        if query_class != None:
            class_data = [{
                'classid': item.classID,
                'classname': item.className,
                'payment_hrs': item.payment_hrs,
                'payment_time': item.payment_time
            } for item in query_class]
            return render_template('class.html', username=query_account.username, all_class=class_data, user_status=user_status)
        else:
            return jsonify(status=False, message='No class in this account.')
    elif int(user_status) == 2 or int(user_status) == 3:
        filters_class_attender = {'attenderEmail': email}
        filters_account = {'email': email}
        query_class = Class_Attender.query.filter_by(
            **filters_class_attender).all()
        query_account = Account.query.filter_by(**filters_account).first()
        # Add username in session (2021-07-15)
        session['username'] = query_account.username
        class_data = []
        if query_class != None:
            for item in query_class:
                filters_class = {'classID': item.classID}
                query_class = Class.query.filter_by(**filters_class).first()
                class_data.append({
                    'classid': query_class.classID,
                    'classname': query_class.className,
                    'payment_hrs': query_class.payment_hrs,
                    'payment_time': query_class.payment_time
                })
            return render_template('class.html', username=query_account.username, all_class=class_data, user_status=user_status)
        else:
            return jsonify(status=False, message='No class in this account.')


@app.route('/class/create', methods=['GET', 'POST'])
def create_class():
    if request.method == 'GET':
        return render_template('class_create.html')
    elif request.method == 'POST':
        # api 4.1.2
        tutorEmail = session.get('email')
        className = request.form.get('classname')
        filters_classname = {'className': className, 'tutorEmail': tutorEmail}
        query_classname = Class.query.filter_by(**filters_classname).first()
        if query_classname != None:
            # Same class name already in this account -> ask user to use another name.
            return jsonify(status=False, message='This class is already in your account. Use tag like xxx_1 to name the class.')
        else:
            try:
                classID = str(uuid.uuid4())
                weekday = request.form.getlist('weekday')
                starttime = request.form.getlist('starttime')
                endtime = request.form.getlist('endtime')
                payment_hrs = request.form.get('payment_hrs')
                payment_time = request.form.get('payment_time')
                startdate = request.form.get('startdate')
                enddate = request.form.get('enddate')
                starttime = [item for item in starttime if item != '']
                endtime = [item for item in endtime if item != '']
                all_date = date_calculate(
                    startdate, enddate, weekday, starttime, endtime)
                all_date = [item for item in all_date]
                # Add url. (2021-07-10)
                url = secrets.token_urlsafe(10)
                # Add hours calculate limit. (2021-07-11)
                for item in all_date:
                    # Fix hour calculate issue (2021-07-12)
                    if hrs_calculate(item[2], item[3]) <= 0:
                        return jsonify(status=False, message='Time input error.')
                # Insert new class into three tables.
                class_init = Class(
                    classID,
                    className,
                    tutorEmail,
                    int(payment_hrs),
                    int(payment_time),
                    url)
                class_time = [Class_Time(
                    classID,
                    item[0],
                    item[1],
                    item[2],
                    item[3],
                    ' ',
                    ' ',
                    0) for item in all_date]
                attendance = [Attendance(
                    classID,
                    item[0],
                    item[2],
                    item[3],
                    0,
                    0,
                    0,
                    ' ',
                    hrs_calculate(item[2], item[3])) for item in all_date]

                db.session.add(class_init)
                db.session.add_all(class_time)
                db.session.add_all(attendance)
                db.session.commit()
                return redirect(url_for('get_class'))
            except:
                return jsonify(status=False, message='Create class failed.')


@ app.route('/class/addmember', methods=['GET', 'POST'])
def add_member():
    if request.method == 'GET':
        return render_template('class_add_member.html')
    # api 4.1.3
    # Fix adding invalid user issue. (2021-07-13)
    elif request.method == 'POST':
        try:
            classID = request.args.get('classid')
            attenderemail = request.args.get('attenderemail').split(',')
            filters_attenderemail = {'classID': classID}
            query_attenderemail = [item.attenderEmail for item in Class_Attender.query.filter_by(
                **filters_attenderemail).all()]

            # Check whether attender is in the class.
            new_attender = []
            exist_attender = []
            for item in attenderemail:
                if item not in query_attenderemail:
                    new_attender.append(item)
                else:
                    exist_attender.append(item)

            # Check whether user is in the db. (invalid user issue)
            valid_attender = []
            invalid_attender = []
            for item in new_attender:
                query_user_check = Account.query.filter_by(email=item).first()
                if query_user_check != None and (query_user_check.status_student or query_user_check.status_parents):
                    valid_attender.append(item)
                elif not (query_user_check.status_student or query_user_check.status_parents):
                    invalid_attender.append([item, 'Status_locked.'])
                else:
                    # Change the description (2021-07-14)
                    invalid_attender.append(
                        [item, 'This email is not registered.'])
            # Insert new attender into Class_Attender table.
            class_attender = [Class_Attender(classID, item)
                              for item in valid_attender]
            db.session.add_all(class_attender)
            db.session.commit()
            return jsonify(status=True, duplicate_attender=exist_attender, invalid_attender=invalid_attender)
        except:
            return jsonify(status=False, message='Add member failed.')


@ app.route('/class/delete', methods=['DELETE'])
def delete_class():
    # api 4.1.4
    try:
        data = request.get_json()
        classID = data['classid']
        filters_class_delete = {'classID': classID}
        # Keep the record in Attendance, Class_Attender and QA tables.
        Class.query.filter_by(**filters_class_delete).delete()
        Class_Time.query.filter_by(**filters_class_delete).delete()
        db.session.commit()
        return jsonify(status=True)
    except:
        return jsonify(status=False, message='Delete class failed.')


# 2021-07-10
# Add share_url route (api 4.1.5)
@ app.route('/class/url', methods=['GET'])
def share_url():
    # api 4.1.5
    try:
        classID = request.args.get('classid')
        filters_share_url = {'classID': classID}
        url = Class.query.filter_by(**filters_share_url).first()
        return jsonify(status=True, url=url.url)
    except:
        return jsonify(status=False, message='Get url failed.')


# 2021-07-10
# Seperate todolist page to
# todolist (api 4.2.1)
# todolist/upcoming (api 4.2.7)
# todolist/done (api 4.2.8)
@ app.route('/todolist', methods=['GET'])
def todolist():
    # api 4.2.1
    # Use session to get email and status.
    email = session.get('email')
    user_status = session.get('user_status')
    username = session.get('username')
    case = user_status  # 1 for tutor, 2 for student and 3 for parents.
    if int(case) == 1:
        try:
            filters_tutor = {'tutorEmail': email}
            query_class = Class.query.filter_by(**filters_tutor).all()
            class_dic = {
                item.className: item.classID for item in query_class}
            return render_template('todolist.html', class_list=class_dic, username=username)
        except:
            return jsonify(status=False, message='Get todolist failed.')
    elif (int(case) == 2) or (int(case) == 3):
        try:
            filters_attender = {'attenderEmail': email}
            query_class = Class_Attender.query.filter_by(
                **filters_attender).all()
            class_dic = {}
            for item in query_class:
                filters_classid = {'classID': item.classID}
                query_class_name = Class.query.filter_by(
                    **filters_classid).first()
                class_dic[query_class_name.className] = item.classID
            return render_template('todolist.html', class_list=class_dic, username=username, user_status=user_status)
        except:
            return jsonify(status=False, message='Get todolist failed.')


@app.route('/todolist/upcoming', methods=['GET', 'POST', 'PUT'])
def todolist_upcoming():
    # api 4.2.7
    if request.method == 'GET':
        user_status = session.get('user_status')
        try:
            classID = request.args.get('classid')
            filters_classid = {'classID': classID}
            query_todo = Class_Time.query.filter_by(**filters_classid).all()
            query_class_name = Class.query.filter_by(**filters_classid).first()
            todo_lst = []
            for item in query_todo:
                if item.done == 0:  # 0 for upcoming ; 1 for done.
                    todo = {
                        'classtimeID': item.classtimeID,
                        'classid': item.classID,
                        'date': date_type(item.date),
                        'weekday': item.weekday,
                        'starttime': time_type(item.starttime),
                        'endtime': time_type(item.endtime),
                        'lesson': item.lesson,
                        'hw': item.hw
                    }
                    todo_lst.append(todo)
            return render_template('todolist.html', classname=query_class_name.className, todo_item=todo_lst, user_status=user_status)
        except:
            return jsonify(status=False, message='Get todolist upcoming failed.')

    # api 4.2.2
    elif request.method == 'PUT':
        try:
            classtimeID = request.args.get('classtimeid')
            classID = request.args.get('classid')
            date = request.args.get('date')
            starttime = request.args.get('starttime')
            endtime = request.args.get('endtime')
            lesson = request.args.get('lesson')
            hw = request.args.get('hw')
            if hrs_calculate(starttime, endtime) <= 0:
                return jsonify(status=False, message='Time input error.')
            # Update new info into Class_Time table.
            filters_todolist_update = {'classtimeID': classtimeID}
            query_todolist_update = Class_Time.query.filter_by(
                **filters_todolist_update).first()
            query_todolist_update.date = date
            query_todolist_update.starttime = starttime
            query_todolist_update.endtime = endtime
            query_todolist_update.lesson = lesson
            query_todolist_update.hw = hw
            # Update new info into Attendance table.
            # attendanceID == classtimeID
            filters_attendance_update = {'attendanceID': classtimeID}
            query_attendance_update = Attendance.query.filter_by(
                **filters_attendance_update).first()
            query_attendance_update.date = date
            query_attendance_update.starttime = starttime
            query_attendance_update.endtime = endtime
            query_attendance_update.hrs = hrs_calculate(starttime, endtime)
            db.session.commit()
            return jsonify(status=True)
        except:
            return jsonify(status=False, message='Create todolist failed.')
    # api 4.2.3
    elif request.method == 'POST':
        try:
            classID = request.args.get('classid')
            date = request.args.get('date')
            starttime = request.args.get('starttime')
            endtime = request.args.get('endtime')
            lesson = request.args.get('lesson')
            hw = request.args.get('hw')
            if hrs_calculate(starttime, endtime) <= 0:
                return jsonify(status=False, message='Time input error.')
            # Insert new todolist into Class_Time table.
            newClassTime = Class_Time(
                classID,
                date,
                get_weekday(date),
                starttime,
                endtime,
                lesson,
                hw,
                0)
            db.session.add(newClassTime)
            # Insert new attendance into Attendance table.
            newAttendance = Attendance(
                classID,
                date,
                starttime,
                endtime,
                0,
                0,
                0,
                ' ',
                hrs_calculate(starttime, endtime))
            db.session.add(newAttendance)
            db.session.commit()
            return jsonify(status=True)
        except:
            return jsonify(status=False, message='Create todolist failed.')


# 2021-07-10
# Add route
# todolist/upcoming/delete (api 4.2.4)
# todolist/upcoming/finished (api 4.2.5)
# todolist/done/undo (api 4.2.6)
@app.route('/todolist/upcoming/delete', methods=['DELETE'])
def delete_todolist():
    # api 4.2.4
    try:
        data = request.get_json()
        classtimeID = data['classtimeid']
        # Delete todolist item directly will also delete attendance item.
        filters_todolist_delete = {'classtimeID': classtimeID}
        filters_attendance_delete = {'attendanceID': classtimeID}
        Class_Time.query.filter_by(**filters_todolist_delete).delete()
        Attendance.query.filter_by(**filters_attendance_delete).delete()
        db.session.commit()
        return jsonify(status=True)
    except:
        return jsonify(status=False, message='Delete todolist failed.')


@app.route('/todolist/upcoming/finished', methods=['POST'])
def finished_todolist():
    # api 4.2.5
    try:
        data = request.get_json()
        classtimeID = data['classtimeid']
        # Update the data to Todolist_Done table first.
        filters_todolist_done = {'classtimeID': classtimeID}
        query_todolist_done = Class_Time.query.filter_by(
            **filters_todolist_done).first()
        todolist_backup = Todolist_Done(
            query_todolist_done.classtimeID,
            query_todolist_done.classID,
            date_type(query_todolist_done.date),
            get_weekday(date_type(query_todolist_done.date)),
            time_type(query_todolist_done.starttime),
            time_type(query_todolist_done.endtime),
            query_todolist_done.lesson,
            query_todolist_done.hw)
        db.session.add(todolist_backup)
        # Update the "done" column of the classtime item in Class_Time
        query_todolist_done.done = 1
        db.session.commit()
        return jsonify(status=True)
    except:
        return jsonify(status=False, message='Todo item done failed.')


@app.route('/todolist/done', methods=['GET'])
def todolist_done():
    # api 4.2.8
    try:
        classID = request.args.get('classid')
        filters_classid = {'classID': classID}
        query_todo = Class_Time.query.filter_by(**filters_classid).all()
        query_class_name = Class.query.filter_by(**filters_classid).first()
        todo_lst = []
        for item in query_todo:
            if item.done == 1:  # 0 for upcoming ; 1 for done.
                todo = {
                    'classtimeID': item.classtimeID,
                    'classid': item.classID,
                    'date': date_type(item.date),
                    'weekday': item.weekday,
                    'starttime': time_type(item.starttime),
                    'endtime': time_type(item.endtime),
                    'lesson': item.lesson,
                    'hw': item.hw
                }
                todo_lst.append(todo)
        return jsonify(status=True, classname=query_class_name.className, todo_item_done=todo_lst)
    except:
        return jsonify(status=False, message='Get todolist done failed.')


@app.route('/todolist/done/undo', methods=['PUT'])
def recover_todolist():
    # api 4.2.6
    try:
        origin_classtimeID = request.args.get('classtimeid')
        # Recover the data to Class_Time table first.
        filters_todolist_undo = {'classtimeID': origin_classtimeID}
        query_todolist_undo = Class_Time.query.filter_by(
            **filters_todolist_undo).first()
        query_todolist_undo.done = 0
        # Delete the data in Todolist_Done
        filters_todolist_done_delete = {
            'origin_classtimeID': origin_classtimeID}
        Todolist_Done.query.filter_by(**filters_todolist_done_delete).delete()
        db.session.commit()
        return jsonify(status=True)
    except:
        return jsonify(status=False, message='Recover todo item failed.')


@app.route('/attendance/<classID>', methods=['GET'])
def attendance(classID):
    # api 4.3.1 & 4.4.1
    try:
        filters_attendance = {'classID': classID}
        query_class_name = Class.query.filter_by(
            **filters_attendance).first()
        query_attendance = Attendance.query.filter_by(
            **filters_attendance).all()
        attendance_lst = [{'classID': classID, 'date': date_type(item.date), 'starttime': time_type(item.starttime), 'endtime': time_type(item.endtime),
                           'check_tutor': item.check_tutor, 'check_studet': item.check_student, 'check_parents': item.check_parents, 'note': item.note, 'hrs': item.hrs} for item in query_attendance]
        return jsonify(status=True, classname=query_class_name.className, attendance_item=attendance_lst)
    except:
        return jsonify(status=False, message='Get attendance info failed.')


@app.route('/attendance/note', methods=['PUT'])
def attendance_note():
    # api 4.3.2
    try:
        attendanceID = request.args.get('attendanceid')
        note = request.args.get('note')
        # Update note info into Attendance table.
        filters_note_update = {'attendanceID': attendanceID}
        query_note_update = Attendance.query.filter_by(
            **filters_note_update).first()
        query_note_update.note = note
        db.session.commit()
        return jsonify(status=True)
    except:
        return jsonify(status=False, message='Note confirm failed.')


@app.route('/attendance/check', methods=['PUT'])
def attendance_check():
    # api 4.3.3
    try:
        attendanceID = request.args.get('attendanceid')
        check_tutor = request.args.get('check_tutor')
        check_student = request.args.get('check_student')
        check_parents = request.args.get('check_parents')
        # Update check info into Attendance table.
        filters_note_update = {'attendanceID': attendanceID}
        query_note_update = Attendance.query.filter_by(
            **filters_note_update).first()
        query_note_update.check_tutor = int(check_tutor)
        query_note_update.check_student = int(check_student)
        query_note_update.check_parents = int(check_parents)
        db.session.commit()
        return jsonify(status=True)
    except:
        return jsonify(status=False, message='Attendance confirm failed.')


@app.route('/attendance/create', methods=['POST'])
def create_attendance():
    # api 4.3.4
    try:
        classID = request.args.get('classid')
        date = request.args.get('date')
        starttime = request.args.get('starttime')
        endtime = request.args.get('endtime')
        note = request.args.get('note')
        if hrs_calculate(starttime, endtime) <= 0:
            return jsonify(status=False, message='Time input error.')
        # Insert new attendance into Attendance table.
        newAttendance = Attendance(
            classID,
            date,
            starttime,
            endtime,
            0,
            0,
            0,
            note,
            hrs_calculate(starttime, endtime))
        db.session.add(newAttendance)
        # Insert new attendance into Class_Time table.
        newClassTime = Class_Time(
            classID,
            date,
            get_weekday(date),
            starttime,
            endtime,
            ' ',
            ' ',
            0)
        db.session.add(newClassTime)
        db.session.commit()
        return jsonify(status=True)
    except:
        return jsonify(status=False, message='Create new attendance item failed.')


# QA Section
@app.route('/QA/<classID>', methods=['GET', 'POST'])
def qa_btn(classID):
    # api 4.5.1 q/a btn
    if request.method == 'GET':
        try:
            #  get data from DB
            filters_classid = {'classID': classID}
            query_qa = QA.query.filter_by(**filters_classid).all()
            query_class = Class.query.filter_by(**filters_classid).first()
            # Search all QA info. for this classID
            if query_class == None:  # check whether this classID existed, if not return status=False
                return jsonify(status=False, message='classID is not found')
            else:
                qa_data = [[{'classname': query_class.className}], [{'qaID': item.qaID, 'classid': item.classID, 'date': item.date,
                                                                     'question': item.question, 'reply': item.reply} for item in query_qa]]
                return jsonify(qa_data)
        except:
            return jsonify(status=False, message='Get QA info failed.')


@app.route('/QA/question/<classID>', methods=['POST'])
def question_btn(classID):
    # api 4.5.2 question_btn
    if request.method == 'POST':
        try:
            # get the data from front-end, qaID is autoincrement
            question = request.args.get('question')

            filters_classid = {'classID': classID}
            query_qa = Class.query.filter_by(**filters_classid).all()
            if len(query_qa) == 0:
                return jsonify(status=False, message='classID is Wrong.')
            else:
                # Insert new question into QA table.
                newquestion = QA(
                    classID,
                    question, '')  # reply default ''
                db.session.add(newquestion)
                db.session.commit()
                return jsonify(status=True)
        except:
            return jsonify(status=False, message='Error, can\'t add the question.')


@app.route('/QA/reply/<classID>', methods=['POST'])
def reply_btn(classID):
    # api 4.5.3 reply btn
    if request.method == 'POST':
        try:
            # get the data from front-end
            qaID = request.args.get('qaID')
            reply = request.args.get('reply')
            filters_classid = {'classID': classID, 'qaID': int(qaID)}
            query_qa = QA.query.filter_by(**filters_classid).first()

            if query_qa != None:
                query_qa.reply = reply
                db.session.commit()
                return jsonify(status=True)
            else:
                return jsonify(status=False, message='query_qa is None.')
        except:
            return jsonify(status=False, message='Create question_btn failed.')


# My Profile Section
@app.route('/myprofile', methods=['GET'])
def myprofile_btn():
    # api 4.6.1 myprofile btn
    try:
        email = session.get('email')
        filters_account = {'email': email}
        query_account = Account.query.filter_by(**filters_account).first()
        account_lst = [{"username": query_account.username, "oldpassword": query_account.password, "phone": query_account.phone,
                        "status_tutor": query_account.status_tutor, "status_student": query_account.status_student, "status_parents": query_account.status_parents}]
        return jsonify(status=True, account_lst=account_lst)
    except:
        return jsonify(status=False, message='Get accoint info failed.')


@app.route('/myprofile/modify', methods=['PUT'])
# pwd的部分還要修改(若儲存時就會是hash_pwd 則新輸入的不用hash就拿去比對，新存的也要為hash過的密碼)
def myprofile_confirm():
    # api 4.6.2 myprofile_confirm
    try:
        email = session.get('email')  # get paremeters from front-end
        filters_account = {'email': email}
        query_account_update = Account.query.filter_by(
            **filters_account).first()

        oldpassword = request.args.get('oldpassword')
        newpassword = request.args.get('newpassword')

        if query_account_update != None:
            # Update account info into Account table.
            DB_pwd = query_account_update.password  # have hashed

            if not bcrypt.check_password_hash(DB_pwd, oldpassword):
                return jsonify(status=False, message='old password is Wrong')
            else:
                if len(newpassword) == 0:  # don't update password
                    pass
                else:
                    # hash
                    hash_newpassword = bcrypt.generate_password_hash(
                        newpassword)
                    if bcrypt.check_password_hash(hash_newpassword, oldpassword):
                        return jsonify(status=False, message='new password is same as the old one')
                    else:
                        query_account_update.password = hash_newpassword

            # Update other info
            if len(request.args.get('new_username')) != 0:
                query_account_update.username = request.args.get(
                    'new_username')
            if len(request.args.get('phone')) != 0:
                query_account_update.phone = request.args.get('phone')

            # from front_end are all String Type, so change to Boolean Type here
            # front-end will limit to type input:0, 1
            new_status_tutor = bool(
                strtobool(request.args.get('status_tutor')))
            new_status_student = bool(
                strtobool(request.args.get('status_student')))
            new_status_parents = bool(
                strtobool(request.args.get('status_parents')))
            new_status_lst = [new_status_tutor,
                              new_status_student, new_status_parents]
            for i in range(len(new_status_lst)):
                if new_status_lst[i] == 0:  # avoid deleting status
                    pass
                else:
                    if i == 0:
                        query_account_update.status_tutor = new_status_tutor
                    if i == 1:
                        query_account_update.status_student = new_status_student
                    if i == 2:
                        query_account_update.status_parents = new_status_parents
            db.session.commit()
            return jsonify(status=True)
        else:
            return jsonify(status=False, message='query_account is None.')
    except:
        return jsonify(status=False, message='Get account info failed.')


# 2021-07-10
# Add get_url route (api 4.1.6)
# Add invite_user route (api 4.1.7)
# Add invite_confirm (api 4.1.8)
# Add invite_login (api 4.1.9)
@app.route('/<url>', methods=['GET'])
def get_url(url):
    # api 4.1.6
    try:
        filters_class_url = {'url': url}
        query_class_url = Class.query.filter_by(**filters_class_url).first()
        if query_class_url != None:
            filters_class_tutor = {'email': query_class_url.tutorEmail}
            query_class_tutor = Account.query.filter_by(
                **filters_class_tutor).first()
            return redirect(url_for('invite_user', tutor=query_class_tutor.username, classid=query_class_url.classID, classname=query_class_url.className))
        else:
            return jsonify(status=False, message='Invalid url.')
    except:
        return jsonify(status=False, message='Get url failed.')


@app.route('/invite/<tutor>&<classid>&<classname>', methods=['GET'])
def invite_user(tutor, classid, classname):
    # api 4.1.7 only for redirect
    try:
        if session['logged_in']:  # If user already log in.
            email = session.get('email')
            filters_account_status = {'email': email}
            query_account_status = Account.query.filter_by(
                **filters_account_status).first()
            filters_class_tutor = {'classID': classid}
            query_class_tutor = Class.query.filter_by(
                **filters_class_tutor).first()
            # Only the account has student or parents status and the account is not the class tutor can add into that class.
            if (query_account_status.status_student or query_account_status.status_parents) and query_class_tutor.tutorEmail != email:
                return redirect(url_for('invite_confirm', email=email, tutor=tutor, classid=classid, classname=classname))
            elif query_class_tutor.tutorEmail == email:
                return jsonify(status=False, message='You are the tutor of this class.')
            else:
                return jsonify(status=False, message='You need to activate student or parents status first.')
    except KeyError:  # If user didn't log in, ask user to login.
        return redirect(url_for('invite_login', tutor=tutor, classid=classid, classname=classname))


@app.route('/invite/confirm/<email>&<tutor>&<classid>&<classname>', methods=['GET'])
def invite_confirm(email, tutor, classid, classname):
    # api 4.1.8
    try:
        filters_attenderemail = {'classID': classid}
        query_attenderemail = [item.attenderEmail for item in Class_Attender.query.filter_by(
            **filters_attenderemail).all()]
        if email not in query_attenderemail:
            # Insert new attender into Class_Attender table.
            class_attender = Class_Attender(classid, email)
            db.session.add(class_attender)
            db.session.commit()
            return jsonify(status=True)
        else:
            return jsonify(status=False, message='User already in this class.')
    except:
        return jsonify(status=False, message='Invite confirm failed.')


@app.route('/invite/login/<tutor>&<classid>&<classname>', methods=['GET', 'POST'])
def invite_login(tutor, classid, classname):
    # api 4.1.9
    if request.method == 'GET':
        return 'Login Please'
    # api 4.1.10
    elif request.method == 'POST':
        email = request.args.get('email')
        password = request.args.get('password')
        user_found = Account.query.filter_by(email=email).first()
        try:
            if user_found:
                # if user exist in database than we will compare our database hased password and password come from login form
                if bcrypt.check_password_hash(user_found.password, password):
                    # if password is matched, allow user to access and save email and username inside the session
                    flash('You have successfully logged in.', "success")
                    # session testing
                    # session.permanent -> True，30min expiration
                    session.permanent = True
                    session['logged_in'] = True
                    session['email'] = user_found.email
                    session['name'] = user_found.username
                    session['status_tutor'] = user_found.status_tutor
                    session['status_student'] = user_found.status_student
                    session['status_parents'] = user_found.status_parents
                    # Get class tutor email.
                    filters_class_tutor = {'classID': classid}
                    query_class_tutor = Class.query.filter_by(
                        **filters_class_tutor).first()
                    if (user_found.status_student or user_found.status_parents) and query_class_tutor.tutorEmail != email:
                        return redirect(url_for('invite_confirm', email=email, tutor=tutor, classid=classid, classname=classname))
                    elif query_class_tutor.tutorEmail == email:
                        return jsonify(status=False, message='You are the tutor of this class.')
                    else:
                        return jsonify(status=False, message='You need to activate student or parents status first.')
                else:
                    # if password is in correct , redirect to login page
                    return jsonify({'status': False, 'note': 'password is wrong'})
            else:
                return jsonify({'status': False, 'note': 'User is not found.'})
        except:
            return jsonify({'status': False, 'note': 'system error'})


@app.route('/forgetpassword', methods=['POST'])
def forget_password():
    # api 2.2
    try:
        if session['logged_in']:
            return jsonify(status=False, message='User already login.')
    except KeyError:
        email = request.get_json()['email']
        #email = request.args.get('email')
        # Check the user is in the database.
        query_user = Account.query.filter_by(email=email).first()
        # need token here
        token = Account.get_reset_password_token(email)
        msg_title = 'Reset Your Password'
        #msg_recipients = [query_user.email]
        msg_body = 'Use this url to reset your password.'

        # send_mail(recipients=msg_recipients,
        #           subject=msg_title,
        #           context=msg_body
        #           #    template='author/mail/resetmail',
        #           #    mailtype='html',
        #           #    user=query_user.username,
        #           #    token=token
        #           )
        flash('Please Check Your Email. Then Click link to Reset Password')
        return jsonify(status=True, message='Reset mail sent.')
# Message(subject='', recipients=None, body=None,
#                          html=None, sender=None, cc=None, bcc=None,
#                          attachments=None, reply_to=None, date=None,
#                          charset=None, extra_headers=None,
#                          mail_options=None, rcpt_options=None)


def send_async_email(app, msg):
    """
    利用多執行緒來處理郵件寄送
    :param app: 實作Flask的app
    :param msg: 實作Message的msg
    :return:
    """
    with app.app_context():
        mail.send(msg)


def send_mail(recipients, subject, context, **kwargs):
    """
    recipients:記得要list格式
    subject:是郵件主旨
    context:郵件內容
    **kwargs:參數
    """
    msg = Message(subject, recipients=recipients)
    msg.body = context
    # msg.html = render_template(template + '.html', **kwargs)
    thr = Thread(target=send_async_email, args=[app, msg])
    thr.start()
    return thr


@app.route('/resetpassword', methods=['GET', 'PUT'])
def reset_password():
    # api 2.3
    # if request.method == 'GET':
    #     try:
    #         if session['logged_in']:
    #             return jsonify(status=False, message='User already login.')
    #     except KeyError:
    #         return 'reset password'

    if request.method == 'PUT':
        try:
            if session['logged_in']:
                return jsonify(status=False, message='User already login.')
        except KeyError:
            email = request.args.get('email')
            query_user_reset_pwd = Account.query.filter_by(email=email).first()
            newpassword = request.get_json()['newpassword']
            # hash
            hash_newpassword = bcrypt.generate_password_hash(newpassword)
            if query_user_reset_pwd != None:
                query_user_reset_pwd.password = hash_newpassword
                db.session.commit()
            return jsonify(status=True, message='New password has been set.')


if __name__ == '__main__':
    # build_sample_db()
    app.run(debug=True)
