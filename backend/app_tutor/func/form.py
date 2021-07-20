from wtforms import form, fields, validators
from app_tutor.func.extension import db
from app_tutor.func.models import Admin


class LoginForm(form.Form):
    login = fields.StringField(validators=[validators.DataRequired()])
    password = fields.PasswordField(validators=[validators.DataRequired()])

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
    login = fields.StringField(validators=[validators.DataRequired()])
    password = fields.PasswordField(validators=[validators.DataRequired()])

    def validate_login(self, field):
        if db.session.query(Admin).filter_by(login=self.login.data).count() > 0:
            raise validators.ValidationError('Duplicate username')
