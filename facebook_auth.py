# ----------------------------------------
# facebook authentication
# ----------------------------------------
from bson.json_util import dumps
from flask import Blueprint, render_template, Response
from flask import url_for, redirect
from flask_login import current_user, login_user, logout_user
from mongodal import dal
from oauth import OAuthSignIn

facebook_auth = Blueprint('facebook_auth', __name__, template_folder='templates')


@facebook_auth.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('poll_machine.index'))


@facebook_auth.route('/log_in')
def log_in():
    return render_template('log_in.html')


@facebook_auth.route('/api/user/login_status')
def is_user_logged_in():
    response = dumps({"logged_in": current_user.is_authenticated})
    return Response(response=response, status=200, mimetype='application/json')


@facebook_auth.route('/authorize/<provider>')
def oauth_authorize(provider):
    if not current_user.is_anonymous:
        return redirect(url_for('poll_machine.index'))
    oauth = OAuthSignIn.get_provider(provider)
    return oauth.authorize()


@facebook_auth.route('/callback/<provider>')
def oauth_callback(provider):
    if not current_user.is_anonymous:
        return redirect(url_for('poll_machine.index'))
    oauth = OAuthSignIn.get_provider(provider)
    social_id, username, email = oauth.callback()
    if social_id is None:
        return redirect(url_for('poll_machine.index'))
    user = dal.find_user(social_id)
    if not user:
        user = dal.create_user(social_id, username, email)
    login_user(user, True)
    return redirect(url_for('poll_machine.index'))
