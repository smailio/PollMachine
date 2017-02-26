from flask import Blueprint
from flask import render_template, request, Response
from bson.json_util import dumps
import time
from flask_login import current_user, login_required

from mongodal import dal

poll_machine = Blueprint('poll_machine', __name__, template_folder='templates')


@poll_machine.route('/')
def index():
    return render_template('index.html')


@poll_machine.route('/api/polls')
def find_polls():
    """"
    Should return voters of polls created by others users only when poll settings allow everyone to see voters
    Should return only public polls created by other users
    Should be able to return polls created by current_user with their voters for not anonymous polls
    """
    limit = int(request.args.get('limit'))
    filters = {"limit": limit}
    if current_user.is_authenticated:
        # current_user is given only when he is authenticated otherwise it will be set to None
        filters["current_user"] = current_user
        filters["exclude_answered"] = True
    else:
        filters["exclude_answered"] = False
    polls = dal.find_polls_jsonifyed(**filters)
    response = Response(response=polls, status=200, mimetype='application/json')
    return response


@poll_machine.route('/api/polls/mine')
def find_user_polls():
    """"
    """
    filters = {}
    if current_user.is_anonymous:
        return Response(status=401, mimetype='application/json')
    else:
        filters["author_id"] = current_user.social_id
        filters["current_user"] = current_user
        filters["exclude_answered"] = False
    polls = dal.find_polls_jsonifyed(**filters)
    response = Response(response=polls, status=200, mimetype='application/json')
    return response


@poll_machine.route('/api/poll/<string:poll_id>')
def find_poll(poll_id):
    """
    Should returns poll whih id poll_id
    Should return voters only if current_user is the poll's author or if everyone is allowed to see voters
    Should return error if poll doesn't exist
    """
    filters = {"poll_id": poll_id}
    if current_user.is_authenticated:
        filters["current_user"] = current_user
    filters["exclude_answered"] = False
    poll = dal.find_polls_jsonifyed(**filters)
    return poll


@poll_machine.route('/api/vote', methods=['POST'])
def vote():
    """
    should not allow users to vote several time for the same poll
    :return:
    """
    content = request.get_json(force=True)
    poll_id = content["poll_id"]
    answer_id = content["answer_id"]
    filters = {"poll_id": poll_id}
    if current_user.is_authenticated:
        filters["current_user"] = current_user
    polls = dal.find_polls(**filters)
    # the poll should exists
    if not polls:
        return Response(status=404, mimetype='application/json')
    poll = polls[0]
    _vote = {"poll_id": poll_id, "answer_id": answer_id}
    # user should be allowed to vote to this poll
    if current_user.is_anonymous:
        if not poll["allow_anonymous_vote"]:
            return Response(status=401, mimetype='application/json')
    else:
        if dal.has_user_voted(current_user.email, poll_id):  # user should not have voted already
            return Response(status=403, mimetype='application/json')
        else:
            _vote["voter_email"] = current_user.email
    dal.vote(**_vote)
    return Response(status=200, mimetype='application/json')


@poll_machine.route('/api/publish', methods=['POST'])
def publish():
    """
    Should save the poll in db and return the id or return error
    Should return error if curren_user.is_anonymous and poll require authentification and only author is allowed to see voters
    If user is connected add author_id
    :return:
    """
    content = request.get_json(force=True)
    new_poll = {
        "question": content["question"],
        "answers": content["answers"],
        "allow_anonymous_vote": content["allow_anonymous_vote"],
        "visibility": content["visibility"],
        "voters_visibility": content.get("voters_visibility")
    }
    if current_user.is_anonymous and new_poll["voters_visibility"] == "me":
        return Response(status=401, mimetype='application/json')
    if current_user.is_authenticated:
        new_poll["author_id"] = current_user.social_id
    new_poll_id = dal.create_poll(**new_poll)
    response = dumps({"new_poll_id": new_poll_id})
    return Response(response=response, status=200, mimetype='application/json')


@poll_machine.route('/api/dumb_request')
@login_required
def respond_to_dumb_request():
    time.sleep(1)
    return dumps({"message": "hello world", "is_authenticated": current_user.is_authenticated})
