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
"identity": identity  
}   
{"status" : 200 or "status" : false}


### Login

#2 login  
post /login {  
"email" : email,  
"password" : password,  
"classid": classid,   
"classname": classname  
}  
{"status" : true or "status" : false}   
// true -> at least one class  
// false -> no class


### Status Selection
#3  

need discuss here  


### Class Section (Default after Status)
  
#4.1.1  class btn  
get /getclass {  
"email": email,   
"classid": classid,   
"classname": classname,  
"starttime": starttime,   
"endtime": endtime,  
"payment_hrs": payment_hrs,  
"payment_time": payment_time  
}   
{"status" : true or "status" : false}  
// true -> at least one class  
// false -> no class  
  
#4.1.2 create btn (create class)  
post /createclass {  
"email" : email,   
"classid": classid,   
"classname": classname,   
"weekday": weekday,   
"starttime": starttime,   
"endtime": endtime,  
"payment_hrs": payment_hrs,  
"payment_time": payment_time  
}  
  
#4.1.3 add member_confirm btn  
post /addmember_confirm {  
"classid": classid,   
"attenderemail": attenderemail  
}  
  
#4.1.4 deleteclass btn  
post /deleteclass {  
"classid": classid  
}  
  
  
### To Do List Section

#4.2.1 todolist btn  
post /todolist {  
"classid": classid,  
"classname": classname,  
"date": date,  
"weekday" : weekday,   
"starttime": starttime,  
"endtime": endtime,   
"lesson": lesson,  
"hw": hw  
}  
  
#4.2.2 update btn (todolist)  
post /todolist {  
"classid": classid,  
"classname": classname,  
"date": date,  
"weekday" : weekday,   
"starttime": starttime,  
"endtime" : endtime,   
"lesson": lesson,  
"hw": hw  
}  
  
#4.2.3 create btn(todolist)  
post /todolist {  
"classid": classid,  
"classname": classname,  
"date": date,  
"weekday" : weekday,   
"starttime": starttime,  
"endtime" : endtime,   
"lesson": lesson,  
"hw": hw  
}  


### Attendance Section  
  
#4.3.1 attendance btn (e.g. python)  
post /attendanec_btn?classid=<> {  
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
  
#4.3.2 confirm btn (attendance note)  
post /notecomfirm {  
"classid": classid,  
"attendanceID": attendanceID,  
"note" : note  
}  
  
#4.3.3 confirm btn (attendance check)  
post /attendance {  
"attendanceID": attendanceID,  
"check_tutor": check_tutor,  
"check_student": check_student,  
"check_parents": check_parents  
}  
  
#4.3.4 create btn (attendance)  
post /attendance_create {  
"classid": classid,  
"date": date,  
"starttime": starttime,  
"endtime": endtime,  
"note" : note,  
"hrs": hrs  
}  
  

### Summary Section  
  
#4.4.1  
post /attendanec_btn?classid=<> {  
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
post/ qa_btn?classid=<> {  
"classid": classid,  
"classname": classname,  
"date": date,  
"question: question,  
"reply": reply  
}  
  
#4.5.2 & 4.5.3 question btn & reply btn   
update /classid=<> {  
"qaID":qaID,  
"classid": classid,  
"question":question,  
"reply": reply  
}  
  
  
### My Profile Section  
  
#4.6.1 myprofile btn  
get /account=<> {  
"name": name,  
"oldpassword": password,  
"phone": phone,  
"status_tutor": status_tutor,   
"status_student": status_student,   
"status_parents": status_parents  
}  
  
#4.6.2 confirm btn (my profile)  
post /account=<> {  
"name": name,  
"oldpassword": oldpassword,  
"newpassword": newpassword,  
"phone": phone,  
"status_tutor": status_tutor,   
"status_student": status_student,   
"status_parents": status_parents  
}  
{"name": name, "oldpassword": password, "phone": phone}  
// any pwd is allowed except for the last time pwd  
  
