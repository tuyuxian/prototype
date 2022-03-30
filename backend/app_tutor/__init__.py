from flask import Flask
from app_tutor.func.extension import db
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_mail import Mail
from config import Config
from flask_login import LoginManager

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, supports_credentials=True)
db.init_app(app)
bcrypt = Bcrypt(app)
mail = Mail(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.session_protection = "basic"
login_manager.login_view = 'login'
login_manager.login_message = 'Please Login First.'

from app_tutor.func import view  # NOQA: E402
from app_tutor.func import admin  # NOQA: E402
