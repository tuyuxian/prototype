import uuid
from models import *
from extension import db, date_calculate, hrs_calculate, get_weekday, time_type, date_type
from flask import Flask, render_template, request, jsonify, session, flash, redirect, logging, url_for
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
    status_student = request.args.get('statust_student')
    status_parents = request.args.get('statust_parents')
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
                status_tutor=1,
                status_student=0,
                status_parents=0
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
    # Removing data from session by setting logged_flag to False.
    session['logged_in'] = False
    session.clear()
    # redirecting to home page
    return 'Bye'


@app.route('/statusSelect', methods=['GET'])
def statusSelect():
    # api 3
    email = session.get('email')
    # status_tutor = session.get('status_tutor')
    # status_student = session.get('status_stdent')
    # status_parents = session.get('status_parents')

    # 先判斷資料庫是否有這組email存在
    user_found = Account.query.filter_by(email=email).first()
    if user_found:
        user_status = request.args.get('user_status')
        session['user_status'] = user_status
        # 找出該email的狀態有哪些
        # Use session?
        # user_status_tutor = user_found.status_tutor
        # user_status_student = user_found.status_student
        # user_status_parents = user_found.status_parents
        return jsonify({"email": user_found.email, "status": user_status})
        # 判斷get回來的使用者狀態為何，並檢查使用者是否有該種狀態，這邊看到時候前端的設計再來改
    else:
        return jsonify({'status': False, 'note': True})


@app.route('/getclass', methods=['GET'])
def getclass():
    # api 4.1.1
    email = session.get('email')
    filters_class = {'tutorEmail': email}
    filters_account = {'email': email}
    query_class = Class.query.filter_by(**filters_class).all()
    query_account = Account.query.filter_by(**filters_account).first()
    if query_class != None:
        class_data = [{'username': query_account.username}, [{'classid': item.classID, 'classname': item.className,
                                                              'payment_hrs': item.payment_hrs, 'payment_time': item.payment_time} for item in query_class]]
        return jsonify(class_data)
    else:
        return dict(status=False, message='No class in this account.')


@app.route('/createclass', methods=['POST'])
def createclass():
    # api 4.1.2
    tutorEmail = session.get('email')
    className = request.args.get('classname')
    filters_classname = {'className': className, 'tutorEmail': tutorEmail}
    query_classname = Class.query.filter_by(**filters_classname).first()
    if query_classname != None:
        # Same class name already in this account -> ask user to use another name.
        return dict(status=False, message='This class is already in your account. Use tag like xxx_1 to name the class.')
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
            # Insert new class into three tables.
            class_init = Class(classID, className, tutorEmail, int(
                payment_hrs), int(payment_time), ' ')
            class_time = [Class_Time(
                classID, item[0], item[1], item[2], item[3], ' ', ' ') for item in all_date]
            attendance = [Attendance(
                classID, item[0], item[2], item[3], 0, 0, 0, ' ', hrs_calculate(item[2], item[3])) for item in all_date]

            db.session.add(class_init)
            db.session.add_all(class_time)
            db.session.add_all(attendance)
            db.session.commit()
            return dict(status=True)
        except:
            return dict(status=False, message='Create class failed.')


@app.route('/addmember_confirm', methods=['POST'])
def addmember_confirm():
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
        return dict(status=True, message=exist_attender)
    except:
        return dict(status=False, message='Add member failed.')


@app.route('/deleteclass', methods=['DELETE'])
def deleteclass():
    # api 4.1.4
    try:
        classID = request.args.get('classid')
        filters = {'classID': classID}
        # Keep the record in Attendance, Class_Attender and QA tables.
        Class.query.filter_by(**filters).delete()
        Class_Time.query.filter_by(**filters).delete()
        db.session.commit()
        return dict(status=True)
    except:
        return dict(status=False, message='Delete class failed.')


@app.route('/todolist', methods=['GET', 'POST', 'PUT'])
def todolist():
    # api 4.2.1
    if request.method == 'GET':
        # Use session to get email and status.
        email = session.get('email')
        user_status = session.get('user_status')

        case = user_status  # 1 for tutor, 2 for student and 3 for parents.
        if case == 1:
            try:
                filters_tutor = {'tutorEmail': email}
                query_class = Class.query.filter_by(**filters_tutor).all()
                class_lst = [[item.classID, item.className]
                             for item in query_class]
                todo_dic = {}
                for item in class_lst:
                    filters_classid = {'classID': item[0]}
                    query_class_time = Class_Time.query.filter_by(
                        **filters_classid).all()
                    todo = [{'classtimeID': info.classtimeID, 'classid': info.classID, 'classname': item[1], 'date':date_type(info.date), 'weekday':info.weekday,
                             'starttime':time_type(info.starttime), 'endtime':time_type(info.endtime), 'lesson':info.lesson, 'hw':info.hw} for info in query_class_time]
                    todo_dic[item[1]] = todo
                return jsonify(todo_dic)
            except:
                return dict(status=False, message='Get todolist failed.')

        elif (case == 2) or (case == 3):
            try:
                filters_attender = {'attenderEmail': 'cylt2212@gmail.com'}
                query_class = Class_Attender.query.filter_by(
                    **filters_attender).all()
                class_lst = []
                for item in query_class:
                    filters_classid = {'classID': item.classID}
                    query_class_name = Class.query.filter_by(
                        **filters_attender).first()
                    class_lst.append(
                        [item.classID, query_class_name.className])
                todo_dic = {}
                for item in class_lst:
                    filters_classid = {'classID': item[0]}
                    query_class_time = Class_Time.query.filter_by(
                        **filters_classid).all()
                    todo = [{'classtimeID': info.classtimeID, 'classid': info.classID, 'classname': item[1], 'date':date_type(info.date), 'weekday':info.weekday,
                             'starttime':time_type(info.starttime), 'endtime':time_type(info.endtime), 'lesson':info.lesson, 'hw':info.hw} for info in query_class_time]
                    todo_dic[item[1]] = todo
                return jsonify(todo_dic)
            except:
                return dict(status=False, message='Get todolist failed.')

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
                return dict(status=False, message='Time input error.')
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
            return dict(status=True)
        except:
            return dict(status=False, message='Create todolist failed.')
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
                return dict(status=False, message='Time input error.')
            # Insert new todolist into Class_Time table.
            newClassTime = Class_Time(classID, date, get_weekday(
                date), starttime, endtime, lesson, hw)
            db.session.add(newClassTime)
            # Insert new attendance into Attendance table.
            newAttendance = Attendance(
                classID, date, starttime, endtime, 0, 0, 0, ' ', hrs_calculate(starttime, endtime))
            db.session.add(newAttendance)
            db.session.commit()
            return dict(status=True)
        except:
            return dict(status=False, message='Create todolist failed.')


@app.route('/attendance/<classID>', methods=["GET"])
def attendance(classID):
    # api 4.3.1 & 4.4.1
    try:
        filters_attendance = {'classID': classID}
        query_class_name = Class.query.filter_by(
            **filters_attendance).first()
        query_attendance = Attendance.query.filter_by(
            **filters_attendance).all()
        attendance_lst = [{'classID': classID, 'classname': query_class_name.className, 'date': date_type(item.date), 'starttime': time_type(item.starttime), 'endtime': time_type(item.endtime),
                           'check_tutor': item.check_tutor, 'check_studet': item.check_student, 'check_parents': item.check_parents, 'note': item.note, 'hrs': item.hrs} for item in query_attendance]
        return jsonify(attendance_lst)
    except:
        return dict(status=False, message='Get attendance info failed.')


@app.route('/note_confirm', methods=['PUT'])
def note_confirm():
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
        return dict(status=True)
    except:
        return dict(status=False, message='Note confirm failed.')


@app.route('/attendance_confirm', methods=['PUT'])
def attendance_confirm():
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
        return dict(status=True)
    except:
        return dict(status=False, message='Attendance confirm failed.')


@app.route('/attendance_create', methods=['POST'])
def attendance_create():
    # api 4.3.4
    try:
        classID = request.args.get('classid')
        date = request.args.get('date')
        starttime = request.args.get('starttime')
        endtime = request.args.get('endtime')
        note = request.args.get('note')
        if hrs_calculate(starttime, endtime) <= 0:
            return dict(status=False, message='Time input error.')
        # Insert new attendance into Attendance table.
        newAttendance = Attendance(
            classID, date, starttime, endtime, 0, 0, 0, note, hrs_calculate(starttime, endtime))
        db.session.add(newAttendance)
        # Insert new attendance into Class_Time table.
        newClassTime = Class_Time(classID, date, get_weekday(
            date), starttime, endtime, ' ', ' ')
        db.session.add(newClassTime)
        db.session.commit()
        return dict(status=True)
    except:
        return dict(status=False, message='Create new attendance item failed.')


# Q/A Section
@app.route('/qa_btn/<classID>', methods=['GET', 'POST'])
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
            return dict(status=False, message='Get QA info failed.')


@app.route('/question_btn/<classID>', methods=['POST'])
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
            return dict(status=False, message='classID is Wrong.')
        else:
            # Insert new question into QA table.
            newquestion = QA(classID, date, question, '')  # reply default ''
            print('newquestion={}'.format(newquestion))
            db.session.add(newquestion)
            db.session.commit()
            return dict(status=True)


@app.route('/reply_btn/<classID>', methods=['POST'])
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
                return dict(status=True)
            else:
                return dict(status=False, message='query_qa is None.')
        except:
            return dict(status=False, message='Create question_btn failed.')


# My Profile Section
@app.route('/myprofile_btn', methods=['GET'])
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
        return dict(status=False, message='Get accoint info failed.')


@app.route('/confirm_btn', methods=['PUT'])
# pwd的部分還要修改(若儲存時就會是hash_pwd 則新輸入的不用hash就拿去比對，新存的也要為hash過的密碼)
def confirm_btn():
    # api 4.6.2 confirm_btn
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
                return dict(status=False, message='old password is Wrong')
            else:
                if bcrypt.check_password_hash(hash_newpassword, oldpassword):
                    return dict(status=False, message='new password is same as the old one')
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
            return dict(status=True)
        else:
            return dict(status=False, message='query_account is None.')
    except Exception as ee:
        print(str(ee))
        return dict(status=False, message='Get account info failed.')


if __name__ == '__main__':
    app.run(debug=True)
