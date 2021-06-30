#Restful Api design
/*忘記密碼(Forgetpwd)
post /forgetpwd {  }*/



1.註冊(Register) :
return render_template(Login.html)

post /register {"email" : email, "password" : password, "name" : name, "identity": identity} 
{"status" : 200  or "status" : false}


2.登入(Login) :
post /login {"email" : email, "password" : password, "identity": identity, "classid": classid, "classname": classname,  "payment":payment} 

{"status" : true or "status" : false} //true代表至少有一堂課, false代表都沒課 

### 先拿email去class table找classID(有什麼課)、classname、payment

return render_template(Profile.html)


3.點選class按鈕(Class)
get /getclass {"email", email, "classid", classid, "classname", classname,"duration":duration, "payment":payment}
{"status" : true or "status" : false} //true代表至少有一堂課, false代表都沒課 

### 帶seesion或JWD先記住userID,用userID去Class table找classID(有什麼課)、classname、payment

4.create class按鈕

### 彈出創造Class視窗
return render_template(createclass.html) 

5. create按鈕

post /createclass {"email" : email, "identity": identity, "classid": classid, "classname": classname, "payment":payment, "starttime":starttime, "endtime": endtime} 









