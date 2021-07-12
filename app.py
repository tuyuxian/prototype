import uuid
import secrets

from sqlalchemy.orm import create_session
from models import *
from extension import db, date_calculate, hrs_calculate, get_weekday, time_type, date_type
from flask import Flask, json, render_template, request, jsonify, session, flash, redirect, logging, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from flask_bcrypt import Bcrypt
from datetime import timedelta
from distutils.util import strtobool

# env
import os
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
db.init_app(app)
bcrypt = Bcrypt(app)


@app.route('/')
def index():
    return 'HI'


@app.route('/register', methods=['POST'])
def register():
    # api 1
    email = request.args.get('email')
    username = request.args.get('username')
    password = request.args.get('password')
    status_tutor = request.args.get('status_tutor')
    status_student = request.args.get('status_student')
    status_parents = request.args.get('status_parents')
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
                # default 1 , wait for front design
                status_tutor=int(status_tutor),
                status_student=int(status_student),
                status_parents=int(status_parents)
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
        return jsonify({'status': 'system error'})


@app.route('/login', methods=['POST'])
def login():
    # api 2
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

                # After successful login, redirecting to select status page
                return jsonify({'status': True})
            else:
                # if password is in correct , redirect to login page
                return jsonify({'status': False, 'note': 'password is wrong'})
        else:
            return jsonify({'status': False, 'note': 'User is not found.'})
    except:
        return jsonify({'status': False, 'note': 'system error'})


@app.route('/logout')
def logout():
    # api 2.1
    # Removing data from session by setting logged_flag to False.
    session['logged_in'] = False
    session.clear()
    # redirecting to home page
    return 'Bye'


@app.route('/status', methods=['GET'])
def status_select():
    # api 3
    email = session.get('email')
    # status_tutor = session.get('status_tutor')
    # status_student = session.get('status_stdent')
    # status_parents = session.get('status_parents')

    # 先判斷資料庫是否有這組email存在
    user_found = Account.query.filter_by(email=email).first()
    if user_found:
        user_status = request.args.get('user_status')
        session['user_status'] = int(user_status)
        # 找出該email的狀態有哪些
        # Use session?
        # user_status_tutor = user_found.status_tutor
        # user_status_student = user_found.status_student
        # user_status_parents = user_found.status_parents
        return jsonify({"email": user_found.email, "status": user_status})
        # 判斷get回來的使用者狀態為何，並檢查使用者是否有該種狀態，這邊看到時候前端的設計再來改
    else:
        return jsonify({'status': False, 'note': True})


@app.route('/class', methods=['GET'])
def get_class():
    # api 4.1.1
    email = session.get('email')
    filters_class = {'tutorEmail': email}
    filters_account = {'email': email}
    query_class = Class.query.filter_by(**filters_class).all()
    query_account = Account.query.filter_by(**filters_account).first()
    if query_class != None:
        class_data = [{
            'classid': item.classID,
            'classname': item.className,
            'payment_hrs': item.payment_hrs,
            'payment_time': item.payment_time
        } for item in query_class]
        return jsonify(username=query_account.username, all_class=class_data)
    else:
        return jsonify(status=False, message='No class in this account.')


@app.route('/class/create', methods=['POST'])
def create_class():
    # api 4.1.2
    tutorEmail = session.get('email')
    className = request.args.get('classname')
    filters_classname = {'className': className, 'tutorEmail': tutorEmail}
    query_classname = Class.query.filter_by(**filters_classname).first()
    if query_classname != None:
        # Same class name already in this account -> ask user to use another name.
        return jsonify(status=False, message='This class is already in your account. Use tag like xxx_1 to name the class.')
    else:
        try:
            classID = str(uuid.uuid4())
            weekday = request.args.get('weekday').split(',')
            starttime = request.args.get('starttime').split(',')
            endtime = request.args.get('endtime').split(',')
            payment_hrs = request.args.get('payment_hrs')
            payment_time = request.args.get('payment_time')
            startdate = request.args.get('startdate')
            enddate = request.args.get('enddate')
            all_date = date_calculate(
                startdate, enddate, weekday, starttime, endtime)
            all_date = [item for item in all_date]
            # Add url. (2021-07-10)
            url = secrets.token_urlsafe(10)
            # Add hours calculate limit. (2021-07-11)
            for item in all_date:
                if hrs_calculate(item[2], item[3]) <= 0: # Fix hour calculate issue.
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
            return jsonify(status=True)
        except:
            return jsonify(status=False, message='Create class failed.')


@app.route('/class/addmember', methods=['POST'])
def add_member():
    # api 4.1.3
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

        # Insert new attender into Class_Attender table.
        class_attender = [Class_Attender(classID, item)
                          for item in new_attender]
        db.session.add_all(class_attender)
        db.session.commit()
        return jsonify(status=True, duplicate_attender=exist_attender)
    except:
        return jsonify(status=False, message='Add member failed.')


@app.route('/class/delete', methods=['DELETE'])
def delete_class():
    # api 4.1.4
    try:
        classID = request.args.get('classid')
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
@app.route('/class/url', methods=['GET'])
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
@app.route('/todolist', methods=['GET'])
def todolist():
    # api 4.2.1
    # Use session to get email and status.
    email = session.get('email')
    user_status = session.get('user_status')
    case = user_status  # 1 for tutor, 2 for student and 3 for parents.
    if int(case) == 1:
        try:
            filters_tutor = {'tutorEmail': email}
            query_class = Class.query.filter_by(**filters_tutor).all()
            class_dic = {
                item.className: item.classID for item in query_class}
            return jsonify(status=True, class_list=class_dic)
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
            return jsonify(status=True, class_list=class_dic)
        except:
            return jsonify(status=False, message='Get todolist failed.')


@app.route('/todolist/upcoming', methods=['GET', 'POST', 'PUT'])
def todolist_upcoming():
    # api 4.2.7
    if request.method == 'GET':
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
            return jsonify(status=True, classname=query_class_name.className, todo_item=todo_lst)
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
        classtimeID = request.args.get('classtimeid')
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
        classtimeID = request.args.get('classtimeid')
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
        # Udpate the "done" column of the classtime item in Class_Time
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

            print('query_qa={}'.format(query_qa))
            if query_qa != None:
                qa_data = [[{'classname': query_class.className}], [{'qaID': item.qaID, 'classid': item.classID, 'date': item.date,
                                                                     'question': item.question, 'reply': item.reply} for item in query_qa]]
                return jsonify(qa_data)
        except:
            return jsonify(status=False, message='Get QA info failed.')


@app.route('/QA/question/<classID>', methods=['POST'])
def question_btn(classID):
    # api 4.5.2 question_btn
    if request.method == 'POST':
        # get the data from front-end
        # qaID is autoincrement
        date = request.args.get('date')
        question = request.args.get('question')

        filters_classid = {'classID': classID}
        query_qa = QA.query.filter_by(**filters_classid).all()
        print('query_qa={}'.format(query_qa))
        if query_qa == None:
            return jsonify(status=False, message='classID is Wrong.')
        else:
            # Insert new question into QA table.
            newquestion = QA(classID, date, question, '')  # reply default ''
            print('newquestion={}'.format(newquestion))
            db.session.add(newquestion)
            db.session.commit()
            return jsonify(status=True)


@app.route('/QA/reply/<classID>', methods=['POST'])
def reply_btn(classID):
    # api 4.5.3 reply btn
    if request.method == 'POST':
        try:
            # get the data from front-end
            qaID = request.args.get('qaID')
            # date = request.args.get('date')
            reply = request.args.get('reply')

            filters_classid = {'classID': classID, 'qaID': int(qaID)}
            query_qa = QA.query.filter_by(**filters_classid).first()
            print('query_qa={}'.format(query_qa))
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
        print('query_account={}'.format(query_account))
        print('query_account.username={}'.format(query_account.username))
        account_lst = [{"username": query_account.username, "oldpassword": query_account.password, "phone": query_account.phone,
                        "status_tutor": query_account.status_tutor, "status_student": query_account.status_student, "status_parents": query_account.status_parents}]
        return jsonify(account_lst)
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
        # hash
        hash_oldpassword = bcrypt.generate_password_hash(oldpassword)
        hash_newpassword = bcrypt.generate_password_hash(newpassword)

        if query_account_update != None:
            # Update account info into Account table.
            DB_pwd = query_account_update.password  # have hashed
            if not bcrypt.check_password_hash(DB_pwd, oldpassword):
                return jsonify(status=False, message='old password is Wrong')
            else:
                if bcrypt.check_password_hash(hash_newpassword, oldpassword):
                    return jsonify(status=False, message='new password is same as the old one')
                else:
                    query_account_update.password = hash_newpassword

            # Update other info
            query_account_update.username = request.args.get(
                'username', query_account_update.username)
            query_account_update.phone = request.args.get(
                'phone', query_account_update.phone)
            # from front_end are all String Type, so change to Boolean Type here
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
    except Exception as ee:
        print(str(ee))
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


if __name__ == '__main__':
    app.run(debug=True)
