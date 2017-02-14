from bson import ObjectId
from pymongo import MongoClient
from bson.json_util import dumps


class Dal:

    def __init__(self):
        client = MongoClient("mongodb://0.0.0.0:32768")
        self.db = client.polldb
        self.polls_collection = self.db.polls

    def find_polls(self, poll_id=False, limit=0):
        _filter = {}
        if poll_id:
            _filter["_id"] = ObjectId(poll_id)
        polls = self.polls_collection.find(
            filter=_filter,
            limit=limit)
        return polls

    def find_polls_jsonifyed(self, poll_id=False, limit=False):
        polls_cursor = self.find_polls(poll_id, limit)
        polls = []
        for poll in polls_cursor:
            poll["poll_id"] = str(poll.get('_id'))
            polls.append(poll)
        polls = {"polls": list(polls)}
        polls_json = dumps(polls)
        return polls_json

    def vote(self, poll_id, answer_id):
        self.polls_collection.update_one(
            {"_id": ObjectId(poll_id), "answers.answer_id": answer_id},
            {"$inc": {"answers.$.voters": 1}}
        )

    def create(self, question, answers):
        new_poll = {"question": question, "answers": []}
        for i, answer in enumerate(answers):
            new_poll["answers"] += [{
                "text": answer["text"],
                "correct": answer["correct"],
                "voters": 0,
                "answer_id": i
            }]
        result = self.db.polls.insert_one(new_poll)
        return str(result.inserted_id)

dal = Dal()
