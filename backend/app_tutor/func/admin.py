import flask_admin as admin
import flask_login as login
from flask_admin.contrib import sqla
from flask_admin import helpers, expose
from app_tutor.func.extension import db
from app_tutor.func.models import *
from flask import request, redirect, url_for
from flask_login import login_user, logout_user, current_user
from app_tutor.func.form import *


# 2021/7/13 更新的部分admin, DataBase需要再多新增一個Admin的table,作為管理員帳號管理用
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
            print(user)
            login_user(user)

        if current_user.is_authenticated:
            return redirect(url_for('.index'))

        self._template_args['form'] = form

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

admin.add_view(MyModelView(Account, db.session))
admin.add_view(MyModelView(Class, db.session))
admin.add_view(MyModelView(Class_Attender, db.session))
admin.add_view(MyModelView(Class_Time, db.session))
admin.add_view(MyModelView(Attendance, db.session))
admin.add_view(MyModelView(QA, db.session))
admin.add_view(MyModelView(Todolist_Done, db.session))
