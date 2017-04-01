from flask import Blueprint
from flask import render_template, request, Response
from bson.json_util import dumps
import time
from flask_login import current_user, login_required
import search
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

    def validate(poll):
        if len(poll["question"]) > 200:
            return False
        max_answer_len = max([len(answer["text"]) for answer in poll["answers"]])
        if max_answer_len > 40:
            return False
        return True

    if not validate(new_poll):
        return Response(status=400, mimetype='application/json')
    if current_user.is_authenticated:
        new_poll["author_id"] = current_user.social_id
    new_poll_id = dal.create_poll(**new_poll)
    if current_user.is_authenticated:
        search.index({
            "author_id": new_poll["author_id"],
            "question": new_poll["question"],
            "answers": new_poll["answers"],
            "db_id": new_poll_id
        })
    response = dumps({"new_poll_id": new_poll_id})
    return Response(response=response, status=200, mimetype='application/json')


@poll_machine.route('/api/mine/search')
# @login_required
def search_in_mine():
    # response = dumps({"polls": [{
    #     "poll_id": "100A",
    #     "allow_anonymous_vote": False,
    #     "visibility": "shareable_by_link",
    #     "answers": [
    #         {"text": "27", "voters_emails": [], "correct": False, "answer_id": 0, "voters": 0},
    #         {"text": "28", "voters_emails": ["smail.a.anis@gmail.com"], "correct": False, "answer_id": 1, "voters": 1},
    #         {"text": "29", "voters_emails": [], "correct": False, "answer_id": 2, "voters": 0}],
    #     "voters_visibility": "nobody",
    #     "question": "combien y a t-il de jours dans le mois de fevrire?"}]
    # })
    filters = {
        "author_id": current_user.social_id,
        "keywords": request.args.get('keywords')
    }
    results = search.search(**filters)
    poll_ids = [result["db_id"] for result in results]
    polls = [dal.find_polls(poll_id=poll_id)[0] for poll_id in poll_ids]
    response = dumps({"polls": polls})
    return Response(response=response, status=200, mimetype='application/json')


@poll_machine.route('/api/dumb_request')
@login_required
def respond_to_dumb_request():
    time.sleep(1)
    return dumps({"message": "hello world", "is_authenticated": current_user.is_authenticated})
