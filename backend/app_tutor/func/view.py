import uuid
import secrets
import os
from sqlalchemy.orm import create_session
from app_tutor.func.models import *
from app_tutor.func.extension import db, date_calculate, hrs_calculate, get_weekday, time_type, date_type
from flask import json, render_template, request, jsonify, session, flash, redirect, logging, url_for, abort, send_from_directory, make_response
from flask_login import login_user, logout_user, login_required, current_user
from flask_mail import Message
from threading import Thread
from app_tutor import app
from app_tutor import mail
from app_tutor import bcrypt
from app_tutor import login_manager
from werkzeug.exceptions import HTTPException


@app.errorhandler(HTTPException)
def handle_exception(e):
    """Return JSON instead of HTML for HTTP errors."""
    # start with the correct headers and status code from the error
    response = e.get_response()
    # replace the body with JSON
    response.data = json.dumps({
        "code": e.code,
        "name": e.name,
        "description": e.description,
    })
    response.content_type = "application/json"
    return response


@login_manager.user_loader
def get_user(email):
    return Account.query.get(email)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route('/register', methods=['GET'])
def register_get():
    if request.method == 'GET':
        return render_template("index.html")


@app.route('/api/register', methods=['POST'])
def api_register_post():
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
            return jsonify({
                'status': True
            })
        else:
            return abort(401, "This email has been used by others.")


@app.route('/login', methods=['GET'])
def login_get():
    if request.method == 'GET':
        return render_template("index.html")


@app.route('/api/login', methods=['POST'])
def api_login_post():
    if request.method == 'POST':
        # api 2
        data = request.get_json()
        email = data['email']
        password = data['password']
        user_found = Account.query.filter_by(email=email).first()
        if user_found:
            # if user exist in database than we will compare our database hased password and password come from login form
            if bcrypt.check_password_hash(user_found.password, password):
                # if password is matched, allow user to access and save email and username inside the session
                # session.permanent -> True，30min expiration
                login_user(user_found)
                session.permanent = True
                session['logged_in'] = True
                session['email'] = user_found.email
                session['username'] = user_found.username
                session['status_tutor'] = user_found.status_tutor
                session['status_student'] = user_found.status_student
                session['status_parents'] = user_found.status_parents
                session['user_status'] = 1
                # After successful login, redirecting to select status page
                return jsonify({
                    'status': True,
                    'email': session.get('email'),
                    'status_tutor': session.get('status_tutor'),
                    'status_student': session.get('status_student'),
                    'status_parents': session.get('status_parents')
                })
            else:
                return abort(401, "Wrong password.")
        else:
            return abort(401, "User is not found.")


@app.route('/api/logout', methods=['POST'])
def api_logout_post():
    if request.method == 'POST':
        # api 2.1
        # Removing data from session by setting logged_flag to False.
        session['logged_in'] = False
        session.clear()
        logout_user()
        # redirecting to home page
        return jsonify({
            'status': True
        })


@app.route('/status', methods=['GET'])
def status_get():
    if request.method == 'GET':
        return render_template("index.html")


@app.route('/api/status', methods=['POST'])
def api_status_post():
    # api 3
    if request.method == 'POST':
        email = session.get('email')
        user_found = Account.query.filter_by(email=email).first()
        if user_found:
            user_status = request.get_json()['user_status']
            session['user_status'] = int(user_status)
            return jsonify({
                'status': True,
                'userStatus': session.get('user_status')
            })
        else:
            return abort(401, "User not found.")


@app.route('/class', methods=['GET'])
def class_get():
    return render_template('index.html')


@app.route('/api/class', methods=['GET'])
def api_class_get():
    # api 4.1.1
    email = session.get('email')
    # Fix status missing issue (2021-07-14)
    user_status = 1  # session.get('user_status')
    if int(user_status) == 1:
        filters_class_tutor = {'tutorEmail': email}
        filters_account = {'email': email}
        query_class = Class.query.filter_by(**filters_class_tutor).all()
        query_account = Account.query.filter_by(**filters_account).first()
        # Add username in session (2021-07-15)
        session['username'] = query_account.username
        if query_class != None:
            class_data = [{
                'id': item.class_id,
                'classId': item.class_id,
                'classTitle': item.class_name,
                'payment_hrs': item.payment_hrs,
                'payment_time': item.payment_time,
                'classUrl': "http://127.0.0.1:5000/"+item.url,
                'classStart': item.start_date,
                'classEnd': item.end_date,
                'classWeekday': " / ",
                'classPayment': item.payment_amount,
                'classPaymentMethod': item.payment_method
            } for item in query_class]
            return jsonify({
                'status': True,
                'username': query_account.username,
                'userStatus': user_status,
                'allClass': class_data
            })
        else:
            return jsonify({
                'status': True,
                'username': query_account.username,
                'userStatus': user_status,
                'allClass': []
            })
    elif int(user_status) == 2 or int(user_status) == 3:
        filters_class_attender = {'attenderEmail': email}
        filters_account = {'email': email}
        query_class = Class_Attender.query.filter_by(
            **filters_class_attender).all()
        query_account = Account.query.filter_by(**filters_account).first()
        # Add username in session (2021-07-15)
        session['username'] = query_account.username
        if query_class != None:
            class_data = []
            for item in query_class:
                filters_class = {'classID': item.classID}
                query_class = Class.query.filter_by(**filters_class).first()
                class_data.append({
                    'classid': query_class.classID,
                    'classname': query_class.className,
                    'payment_hrs': query_class.payment_hrs,
                    'payment_time': query_class.payment_time
                })
            return jsonify({
                'status': True,
                'username': query_account.username,
                'userStatus': user_status,
                'allClass': class_data
            })
        else:
            return jsonify({
                'status': True,
                'username': query_account.username,
                'userStatus': user_status,
                'allClass': []
            })


@app.route('/api/class/create', methods=['POST'])
def api_class_create_post():
    if request.method == 'POST':
        # api 4.1.2
        tutorEmail = session.get('email')
        data = request.get_json()
        className = data['className']
        filtersClassname = {'className': className, 'tutorEmail': tutorEmail}
        queryClassname = Class.query.filter_by(**filtersClassname).first()
        if queryClassname != None:
            # Same class name already in this account -> ask user to use another name.
            return abort(403, "This class is already in your account. Use tag like xxx_1 to name the class.")
        else:
            try:
                print(request.get_json())
                classID = str(uuid.uuid4())
                weekday = [k for k, v in data['weekday'].items() if v]
                starttime = data['startTime']
                endtime = data['endTime']
                payment_method = data['paymentMethod']
                payment_amount = data['paymentAmount']
                startdate = data['startDate']
                enddate = data['endDate']
                # starttime = [item for item in starttime if item != '']
                # endtime = [item for item in endtime if item != '']
                # all_date = date_calculate(
                #     startdate, enddate, weekday, starttime, endtime)
                # all_date = [item for item in all_date]
                url = 'http://127.0.0.1:5000/' + secrets.token_urlsafe(10)
                # # Add hours calculate limit. (2021-07-11)
                # for item in all_date:
                #     # Fix hour calculate issue (2021-07-12)
                #     if hrs_calculate(item[2], item[3]) <= 0:
                #         return jsonify(status=False, message='Time input error.')
                # # Insert new class into three tables.
                # class_init = Class(
                #     classID, className, tutorEmail, int(payment_hrs), int(payment_time), url)
                # class_time = [Class_Time(
                #     classID, item[0], item[1], item[2], item[3], ' ', ' ', 0) for item in all_date]
                # attendance = [Attendance(
                #     classID, item[0], item[2], item[3], 0, 0, 0, ' ', hrs_calculate(item[2], item[3])) for item in all_date]

                # db.session.add(class_init)
                # db.session.add_all(class_time)
                # db.session.add_all(attendance)
                # db.session.commit()
                return jsonify({
                    'status': True,
                    'classID': classID,
                    'classUrl': url,
                    'className': className,
                    'classStart': startdate,
                    'classEnd': enddate,
                    'classWeekday': weekday,
                    'classPayment': payment_amount
                })
            except:
                return abort(400, "Create class failed.")


@ app.route('/api/class/addmember', methods=['POST'])
def api_class_addmember_post():
    # api 4.1.3
    # Fix adding invalid user issue. (2021-07-13)
    if request.method == 'POST':
        try:
            data = request.get_json()
            classID = data['classid']
            attenderemail = data['attenderemail'].split(',')
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
                    # Change the description (2022-03-29)
                    invalid_attender.append({
                        'email': item,
                        'status': 'User status locked.'
                    })
                else:
                    # Change the description (2022-03-29)
                    invalid_attender.append({
                        'email': item,
                        'status': 'Invalid email.'
                    })
            # Insert new attender into Class_Attender table.
            class_attender = [Class_Attender(classID, item)
                              for item in valid_attender]
            db.session.add_all(class_attender)
            db.session.commit()
            return jsonify({
                'status': True,
                'duplicateAttender': exist_attender,
                'invalidAttender': invalid_attender
            })
        except:
            return abort(400, "Add class member failed.")


@ app.route('/api/class/delete', methods=['DELETE'])
def api_class_delete():
    # api 4.1.4
    try:
        data = request.get_json()
        classID = data['classid']
        filters_class_delete = {'classID': classID}
        # Keep the record in Attendance, Class_Attender and QA tables.
        Class.query.filter_by(**filters_class_delete).delete()
        Class_Time.query.filter_by(**filters_class_delete).delete()
        db.session.commit()
        return jsonify({
            'status': True
        })
    except:
        return abort(410, "Delete class failed. The class has gone.")


# 2022-03-29
# Add class_url_get route (api 4.1.5)
@ app.route('/api/class/url', methods=['GET'])
def api_class_url_get():
    # api 4.1.5
    if request.method == 'GET':
        try:
            classID = request.get_json()['classid']
            filters_share_url = {'classID': classID}
            url = Class.query.filter_by(**filters_share_url).first()
            return jsonify({
                'status': True,
                'url': url.url
            })
        except:
            return abort(404, "Get class share url failed.")


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
            classID = request.get_json()['classid']
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
            data = request.get_json()
            classtimeID = data['classtimeid']
            classID = data['classid']
            date = data['date']
            starttime = data['starttime']
            endtime = data['endtime']
            lesson = data['lesson']
            hw = data['hw']
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
            data = request.get_json()
            classID = data['classid']
            date = data['date']
            starttime = data['starttime']
            endtime = data['endtime']
            lesson = data['lesson']
            hw = data['hw']
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
        classID = request.get_json()['classid']
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
        origin_classtimeID = request.get_json()['classtimeid']
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


@app.route('/Attendance/<classID>', methods=['GET'])
def attendance(classID):
    # api 4.3.1 & 4.4.1
    try:
        filters_attendance = {'classID': classID}
        query_class_name = Class.query.filter_by(
            **filters_attendance).first()
        query_attendance = Attendance.query.filter_by(
            **filters_attendance).all()
        query_attendance = sorted(query_attendance, key=lambda x: x.date)
        attendance_lst = [{
            'attendanceID': item.attendanceID,
            'date': date_type(item.date),
            'starttime': time_type(item.starttime),
            'endtime': time_type(item.endtime),
            'check_tutor': item.check_tutor,
            'check_studet': item.check_student,
            'check_parents': item.check_parents,
            'note': item.note,
            'hrs': item.hrs} for item in query_attendance]
        return jsonify(status=True, classname=query_class_name.className, classID=classID, attendance_item=attendance_lst)
    except:
        return abort(400, "Get attendance info failed.")


@app.route('/Attendance/note', methods=['PUT'])
def attendance_note():
    # api 4.3.2
    try:
        data = request.get_json()
        attendanceID = data['attendanceid']
        note = data['note']
        # Update note info into Attendance table.
        filters_note_update = {'attendanceID': attendanceID}
        query_note_update = Attendance.query.filter_by(
            **filters_note_update).first()
        query_note_update.note = note
        db.session.commit()
        return jsonify(status=True)
    except:
        return abort(400, "Edit note failed.")


@app.route('/Attendance/check', methods=['PUT'])
def attendance_check():
    # api 4.3.3
    try:
        data = request.get_json()
        attendanceID = data['attendanceid']
        # Add session to identify the user status.
        check_tutor = data['check_tutor']
        check_student = data['check_student']
        check_parents = data['check_parents']
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
        return abort(400, "Update check failed.")


@app.route('/Attendance/create', methods=['POST'])
def create_attendance():
    # api 4.3.4
    try:
        data = request.get_json()
        classID = data['classid']
        date = data['date']
        starttime = data['starttime']
        endtime = data['endtime']
        note = data['note']
        if hrs_calculate(starttime, endtime) <= 0:
            return jsonify(status=False, message='Time input error.')
        # Insert new attendance into Attendance table.
        newAttendance = Attendance(
            classID, date, starttime, endtime, 0, 0, 0, note, hrs_calculate(
                starttime, endtime)
        )
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
        return abort(400, message="Create new attendance item failed.")


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
                qa_data = [{'qaID': item.qaID, 'classid': item.classID, 'date': date_type(
                    item.date), 'question': item.question, 'reply': item.reply} for item in query_qa]
                return jsonify(status=True, classname=query_class.className, qa_data=qa_data)
        except:
            return jsonify(status=False, message='Get QA info failed.')


@app.route('/QA/question/<classID>', methods=['POST'])
def question_btn(classID):
    # api 4.5.2 question_btn
    if request.method == 'POST':
        try:
            # get the data from front-end, qaID is autoincrement
            question = request.get_json()['question']
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
            return jsonify(status=False, message='Add question failed.')


@app.route('/QA/reply/<classID>', methods=['POST'])
def reply_btn(classID):
    # api 4.5.3 reply btn
    if request.method == 'POST':
        try:
            # get the data from front-end
            data = request.get_json()
            qaID = data['qaID']
            reply = data['reply']
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
        email = 'test1234@gmail.com'
        filters_account = {'email': email}
        query_account = Account.query.filter_by(**filters_account).first()
        account_info = {"username": query_account.username, "oldpassword": query_account.password, "phone": query_account.phone,
                        "status_tutor": query_account.status_tutor, "status_student": query_account.status_student, "status_parents": query_account.status_parents}
        return jsonify(status=True, account_info=account_info)
    except:
        return jsonify(status=False, message='Get account info failed.')


@app.route('/myprofile/modify', methods=['PUT'])
# pwd的部分還要修改(若儲存時就會是hash_pwd 則新輸入的不用hash就拿去比對，新存的也要為hash過的密碼)
def myprofile_confirm():
    # api 4.6.2 myprofile_confirm
    # try:
    email = session.get('email')  # get paremeters from front-end
    email = 'test1234@gmail.com'
    filters_account = {'email': email}
    query_account_update = Account.query.filter_by(
        **filters_account).first()
    data = request.get_json()

    if query_account_update != None:
        # Update account info into Account table.
        DB_pwd = query_account_update.password  # have hashed
        if 'oldpassword' in data:
            oldpassword = data['oldpassword']
            if not bcrypt.check_password_hash(DB_pwd, oldpassword):
                return jsonify(status=False, message='Old password is wrong.')
            else:
                if 'newpassword' not in data:  # don't update password
                    pass
                else:
                    newpassword = data['newpassword']
                    # hash
                    hash_newpassword = bcrypt.generate_password_hash(
                        newpassword)
                    if bcrypt.check_password_hash(hash_newpassword, oldpassword):
                        return jsonify(status=False, message='New password is same as the old one.')
                    else:
                        query_account_update.password = hash_newpassword

        # Update other info
        if 'username' in data:
            query_account_update.username = data['username']
        if 'phone' in data:
            query_account_update.phone = data['phone']
        # from front_end are all String Type, so change to Boolean Type here
        # front-end will limit to type input:0, 1
        new_status_tutor = 1 if data['status_tutor'] else 0
        new_status_student = 1 if data['status_student'] else 0
        new_status_parents = 1 if data['status_parents'] else 0
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
    # except:
    #     return jsonify(status=False, message='Update account info failed.')


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
                    return jsonify(status=False, note='password is wrong')
            else:
                return jsonify(status=False, note='User is not found.')
        except:
            return jsonify(status=False, note='system error')


@app.route('/Forget', methods=['GET', 'POST'])
def forget_password():
    if request.method == 'GET':
        return render_template("index.html")
    # api 2.2
    elif request.method == 'POST':
        try:
            if session['logged_in']:
                return abort(406, "User is already login.")
        except KeyError:
            email = request.get_json()['email']
            # Check the user is in the database.
            query_user = Account.query.filter_by(email=email).first()
            if query_user:
                # need token here
                token = query_user.get_reset_password_token()
                msg_title = 'Reset Your Password'
                msg_recipients = [query_user.email]
                msg_body = 'Use this url to reset your password.'

                send_mail(recipients=msg_recipients,
                          subject=msg_title,
                          context=msg_body,
                          template='resetmail',
                          mailtype='.html',
                          user=query_user.username,
                          token=token
                          )
                return jsonify(status=True)
            else:
                return abort(401, "User is not found.")


def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)


def send_mail(recipients, subject, context, template, mailtype, **kwargs):
    msg = Message(subject, recipients=recipients)
    msg.body = context
    msg.html = render_template(template + mailtype, **kwargs)
    thr = Thread(target=send_async_email, args=[app, msg])
    thr.start()
    return thr


@app.route('/Reset', methods=['GET', 'PUT'])
def reset_password():
    # api 2.3
    if request.method == 'GET':
        try:
            if session['logged_in']:
                return jsonify(status=False, message='User already login.')
        except KeyError:
            token = request.args.get('token')
            reset_token = Account.verify_reset_password_token(
                token)
            session['reset_user_email'] = reset_token.email
            return render_template("index.html")

    if request.method == 'PUT':
        try:
            if session['logged_in']:
                return abort(406, "User is already login.")
        except KeyError:
            email = session.get('reset_user_email')
            query_user_reset_pwd = Account.query.filter_by(email=email).first()
            data = request.get_json()
            newpassword = data['newpassword']
            id_confirmation = data['birthday']
            # hash
            hash_newpassword = bcrypt.generate_password_hash(newpassword)
            if query_user_reset_pwd != None:
                if date_type(query_user_reset_pwd.personal_question) == id_confirmation:
                    query_user_reset_pwd.password = hash_newpassword
                    db.session.commit()
                    return jsonify(status=True)
                else:
                    return abort(401, "ID confirmation failed.")
            else:
                return abort(401, "User is not found.")
