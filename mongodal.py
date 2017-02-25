from bson import ObjectId
from flask_login import UserMixin
from pymongo import MongoClient
from bson.json_util import dumps


class User(UserMixin):
    def __init__(self, social_id, nickname, email):
        self.social_id = social_id
        self.nickname = nickname
        self.email = email

    def get_id(self):
        return self.social_id


class Dal:
    def __init__(self):
        client = MongoClient("mongodb://0.0.0.0:32768")
        self.db = client.polldb
        self.polls_collection = self.db.polls

    def find_polls(
            self,
            current_user=None,
            poll_id=None,
            author_id=None,
            exclude_answered=True,
            limit=0):
        filters = {}
        if poll_id:
            filters["_id"] = ObjectId(poll_id)
        if author_id:
            filters["author_id"] = author_id
        if not author_id and not poll_id:
            filters["visibility"] = "public"
        if exclude_answered and current_user:
            filters["answers.voters_emails"] = {"$ne": current_user.email}
        if not current_user and not poll_id:
            filters["allow_anonymous_vote"] = True
        polls_cursor = self.polls_collection.find(filter=filters, limit=limit)
        polls = []
        for poll in polls_cursor:
            poll["poll_id"] = str(poll.get('_id'))
            if not exclude_answered and current_user and self.has_user_voted(current_user.email, poll["poll_id"]):
                poll["answered"] = True
            for answer in poll["answers"]:
                current_user_is_author = current_user and \
                                         "author_id" in poll and \
                                         current_user.social_id == poll["author_id"]
                voters_visibility = poll["voters_visibility"]
                if voters_visibility == "nobody" or (voters_visibility == "me" and not current_user_is_author):
                    answer["voters_emails"] = []
            polls.append(poll)
        return polls

    def find_polls_jsonifyed(self, **filters):
        polls = self.find_polls(**filters)
        polls = {"polls": list(polls)}
        polls_json = dumps(polls)
        return polls_json

    def vote(self, poll_id, answer_id, voter_email=None):
        _update = {"$inc": {"answers.$.voters": 1}}
        if voter_email:
            _update["$push"] = {"answers.$.voters_emails": voter_email}
        self.polls_collection.update_one(
            {"_id": ObjectId(poll_id), "answers.answer_id": answer_id},
            _update
        )
        if voter_email:
            self.db.users.update_one(
                {"email": voter_email},
                {"$push": {"voted_polls": poll_id}}
            )

    def create_poll(self, question, answers, allow_anonymous_vote, visibility, voters_visibility, author_id=None):
        new_poll = {
            "question": question,
            "answers": [],
            "allow_anonymous_vote": allow_anonymous_vote,
            "visibility": visibility,
            "voters_visibility": voters_visibility
        }
        if author_id:
            new_poll["author_id"] = author_id
        for i, answer in enumerate(answers):
            new_poll["answers"] += [{
                "text": answer["text"],
                "correct": answer["correct"],
                "voters": 0,
                "voters_emails": [],
                "answer_id": i
            }]
        result = self.db.polls.insert_one(new_poll)
        return str(result.inserted_id)

    def find_user(self, social_id):
        user = self.db.users.find_one(filter={"social_id": social_id})
        if user is None:
            return False
        return User(user["social_id"], user["username"], user["email"])

    def create_user(self, social_id, username, email):
        self.db.users.insert_one({
            "social_id": social_id,
            "username": username,
            "email": email
        })
        return User(social_id, username, email)

    def has_user_voted(self, email, poll_id):
        user = self.db.users.find_one(filter={"email": email, "voted_polls": poll_id})
        return user is not None


dal = Dal()
