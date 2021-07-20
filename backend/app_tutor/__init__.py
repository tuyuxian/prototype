from flask import Flask
from app_tutor.func.extension import db
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_mail import Mail
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)
bcrypt = Bcrypt(app)
mail = Mail(app)

from app_tutor.func import view  # NOQA: E402
