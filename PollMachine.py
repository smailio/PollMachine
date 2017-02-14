from pprint import pprint

from flask import Flask, render_template, request
from bson.json_util import dumps
import time

from mongodal import dal
app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/tryaxios')
def try_axios():
    return render_template('try_axios.html')


@app.route('/api/polls')
def find_polls():
    limit = int(request.args.get('limit'))
    polls = dal.find_polls_jsonifyed(limit=limit)
    response = app.response_class(
        response=polls,
        status=200,
        mimetype='application/json'
    )
    return response


@app.route('/api/poll/<string:poll_id>')
def find_poll(poll_id):
    poll = dal.find_polls_jsonifyed(poll_id=poll_id)
    return poll


@app.route('/api/vote', methods=['POST'])
def vote():
    content = request.get_json(force=True)
    poll_id = content["poll_id"]
    answer_id = content["answer_id"]
    dal.vote(poll_id, answer_id)
    return 'True'


@app.route('/api/publish', methods=['POST'])
def publish():
    content = request.get_json(force=True)
    question = content["question"]
    answers = content["answers"]
    return dal.create(question, answers)


@app.route('/api/dumb_request')
def respond_to_dumb_request():
    time.sleep(1)
    return dumps({"message": "hello world"})

if __name__ == '__main__':
    app.run(debug=True)
