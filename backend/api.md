# Restful API Design


### Homepage

#0

// for homepage


### Register

#1 register  
post /register {  
"email" : email,  
"password" : password,  
"username" : username,  
"status_tutor": status_tutor,
"status_student": status_student,
"status_parents": status_parents,  
"personal_question": personal_question  
}   
{"status" : 200 or "status" : false}


### Login/Logout

#2 login  
post /login {  
"email" : email,  
"password" : password,    
}  
{"status" : true or "status" : false}   
// true -> at least one class  
// false -> no class  
  

#2.1 get /logout {      
}  
  
  
### Status Selection  
  
#3 status select  
post/ status {  
"email": email,  
"status": (1,2,3)  
}


### Class Section (Default after Status)
  
#4.1.1  class btn  
get /class {  
"username": username,   
"classid": classid,   
"classname": classname,  
"payment_hrs": payment_hrs,  
"payment_time": payment_time  
}   
{"status" : true or "status" : false}  

#4.1.2 create btn (create class)  
post /class/create {  
"email" : email,   
"classid": classid, 
"classname": classname,   
"weekday": weekday,   
"starttime": starttime,   
"endtime": endtime,  
"payment_hrs": payment_hrs,  
"payment_time": payment_time,  
"url": url   
}  
  
#4.1.3 add member_confirm btn  
post /class/addmember {  
"classid": classid,   
"attenderemail": attenderemail  
}  
  
#4.1.4 deleteclass btn  
delete /class/delete {  
"classid": classid  
}  
  
#4.1.5 shareurl btn
get /class/url {  
"classid": classid  
}  
  
#4.1.6 get url  
get /<url> {  
"classid": classid,  
"tutor": tutor,  
"classname": classname  
}  
  
#4.1.7 invite user
get /invite/<tutor>&<classid>&<classname> {  
"classid": classid,  
"email": email,  
"classname":classname,  
"tutor": tutor  
}  
// if user not login -> don't deliever email.  
  
#4.1.8 invite confirm
get /invite/confirm/<email>&<tutor>&<classid>&<classname> {  
}  
  
#4.1.9 invite login
get /invite/login/<email>&<tutor>&<classid>&<classname> {  
}  
  
#4.1.10 invite login
post /invite/login/<email>&<tutor>&<classid>&<classname> {  
"classid": classid,  
"email": email,  
"classname":classname,  
"tutor": tutor  
}  
  
  
### To Do List Section

#4.2.1 todolist btn  
get /todolist {  
"classid": classid,  
"classname": classname  
}  
  
#4.2.2 update btn (todolist)  
put /todolist/upcoming {  
"classid": classid,  
"classname": classname,  
"date": date,  
"starttime": starttime,  
"endtime" : endtime,   
"lesson": lesson,  
"hw": hw  
}  
  
#4.2.3 create btn(todolist)  
post /todolist/upcoming {  
"classid": classid,  
"date": date,   
"starttime": starttime,  
"endtime" : endtime,   
"lesson": lesson,  
"hw": hw  
}  
  
#4.2.4 delete btn (todolist)  
delete /todolist/upcoming/delete {  
"classtimeid": classtimeid  
}  
  
#4.2.5 finished btn (todolist)  
post /todolist/upcoming/finished {  
"classtimeid": classtimeid,  
}  
  
#4.2.6 undo btn (todolist)
put /todolist/done/undo {  
    "classtimeid": classtimeid  
}  
  
#4.2.7 upcoming btn (todolist)  
get /todolist/upcoming {  
"classtimeid": classtimeid,
"classid": classid,  
"classname": classname,  
"date": date,  
"weekday": weekday,  
"starttime": starttime,  
"endtime": endtime,  
"lesson": lesson,  
"hw": hw,  
}  
  
#4.2.8 done btn (todolist)  
get /todolist/done {  
"classtimeid": classtimeid,
"classid": classid,  
"classname": classname,  
"date": date,  
"weekday": weekday,  
"starttime": starttime,  
"endtime": endtime,  
"lesson": lesson,  
"hw": hw,  
}  
  
### Attendance Section  
  
#4.3.1 attendance btn (e.g. python)  
get /attendance/<classID> {  
"classid": classid,  
"classname": classname,  
"date": date,  
"starttime": starttime,  
"endtime": endtime,  
"check_tutor": check_tutor,  
"check_student": check_student,  
"check_parents": check_parents,  
"note": note,  
"hrs": hrs  
}  
  
#4.3.2 confirm btn (attendance note)  
put /attendance/note {  
"attendanceID": attendanceID,  
"note" : note  
}  
  
#4.3.3 confirm btn (attendance check)  
put /attendance/check {  
"attendanceID": attendanceID,  
"check_tutor": check_tutor,  
"check_student": check_student,  
"check_parents": check_parents  
}  
  
#4.3.4 create btn (attendance)  
post /attendance/create {  
"classid": classid,  
"date": date,  
"starttime": starttime,  
"endtime": endtime,  
"note" : note  
}  
  

### Summary Section  
  
#4.4.1  
get /attendande/<classID> {  
"classid": classid,  
"classname": classname,  
"date": date,  
"startTime": starttime,  
"endTime": endTime,  
"check_tutor": check_tutor,  
"check_student": check_student,  
"check_parents": check_parents,  
"note": note,  
"hrs": hrs  
}  
  
  
### Q/A Section  
  
#4.5.1 q/a btn (e.g. python)  
get /QA/<classID> {  
"qaid": qaid,  
"classid": classid,  
"classname": classname,  
"date": date,  
"question: question,  
"reply": reply  
}  
  
#4.5.2 question btn  
post /QA/question/<classID> {  
"date": date,  
"classid": classid,  
"question":question  
}  

4.5.3 reply btn  
post /QA/reply/<classID> {  
"qaID": qaID,  
"classID": classid,  
"reply": reply  
}  
  
### My Profile Section  
  
#4.6.1 myprofile btn  
get /myprofile {  
"username": username,  
"oldpassword": password,  
"phone": phone,  
"status_tutor": status_tutor,   
"status_student": status_student,   
"status_parents": status_parents  
}  
  
#4.6.2 confirm btn (my profile)  
put /myprofile/modify {  
"username": username,  
"oldpassword": oldpassword,  
"newpassword": newpassword,  
"phone": phone,  
"status_tutor": status_tutor,   
"status_student": status_student,   
"status_parents": status_parents  
}  
{"name": name, "oldpassword": password, "phone": phone}  
// any pwd is allowed except for the last time pwd  
  
