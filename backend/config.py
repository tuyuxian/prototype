import os
from dotenv import load_dotenv
from datetime import timedelta
load_dotenv()


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=30)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PROT = 465
    MAIL_USE_TLS = True
    MAIL_DEFAULT_SENDER = ('admin', os.getenv('MAIL_USERNAME'))
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
