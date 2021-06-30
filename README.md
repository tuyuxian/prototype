# 使用者需求
1.課程
  身分: 老師、學生、家長
  (群組的概念) 
  
  屬性: 上課時數、  

#Restful Api design

註冊(Register) :
return render_template(Login.html)

post /register {"account" : account, "email" : email, "password" : password, "name" : name, "identity": identity} 
{"status" : 200  or "status" : false}


登入(Login) :
return render_template(Profile.html)


post /login {"account" : account, "password" : password, "identity": identity, "classid": classid, "name": name} 
{"status" : true or "status" : fail}

/*忘記密碼(Forgetpwd)
post /forgetpwd {  }*/


點選class按鈕(Class)

##帶seesion或JWD先記住userID (tutorID),用userID去Class table找相對應的課程

get /getclass {"userid", userid, "classid", classid, "name", name, }

1 python 3個月 url tutorid
2 math 











