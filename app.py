from flask import Flask
from PollMachine import poll_machine
from facebook_auth import facebook_auth
from flask_login import LoginManager
from mongodal import dal

flask_app = Flask(__name__)
lm = LoginManager(flask_app)
lm.login_view = 'poll_machine.log_in'

flask_app.config['SECRET_KEY'] = 'obvious password'
flask_app.config['OAUTH_CREDENTIALS'] = {
    'facebook': {
        'id': '296184104129661',
        'secret': '1d73e99c0210fa79e3c320dac6e9e448'
    },
    'twitter': {
        'id': '3RzWQclolxWZIMq5LJqzRZPTl',
        'secret': 'm9TEd58DSEtRrZHpz2EjrV9AhsBRxKMo8m3kuIZj3zLwzwIimt'
    }
}


@lm.user_loader
def load_user(social_id):
    return dal.find_user(social_id)

flask_app.register_blueprint(poll_machine)
flask_app.register_blueprint(facebook_auth)
