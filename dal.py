from flask import jsonify


class Poll:
    def __init__(self, poll_id, question, answers):
        """

        :param int poll_id:
        :param str question:
        :param Answer answers:
        :type answers: list of Answer
        """
        self.poll_id = poll_id
        self.question = question
        self.answers = answers

    def vote(self, answer_id):
        for answer in self.answers:
            if answer.answer_id == answer_id:
                answer.add_voter()


class Answer:
    def __init__(self, answer_id, text, correct, voters):
        """

        :param int answer_id:
        :param str text:
        """
        self.answer_id = answer_id
        self.text = text
        self.voters = voters
        self.correct = correct

    def add_voter(self):
        self.voters += 1


class Dal:
    def __init__(self):
        self.polls = [
            Poll(
                0,
                "What color is the sun in the middle of the day?",
                [
                    Answer(0, "White", True, 1000),
                    Answer(1, "Blue", False, 2),
                    Answer(2, "Yellow", False, 3000)
                ]
            ),
            Poll(
                1,
                "What is the percentage of musulims in France?",
                [
                    Answer(10, "8%", True, 100),
                    Answer(11, "18%", False, 1200),
                    Answer(12, "28%", False, 3000)
                ]
            ),
            Poll(
                2,
                "How much do you need to earn to be in the top 5% richest of France?",
                [
                    Answer(20, "7500 €", True, 1000),
                    Answer(21, "75000 €", False, 12000),
                    Answer(22, "750000 €", False, 8000),
                ]
            ),
            Poll(
                3,
                "What is Donal Trump weight?",
                [
                    Answer(30, "77 kg", False, 1000),
                    Answer(31, "87 kg", False, 12000),
                    Answer(32, "97 kg", False, 1200),
                    Answer(33, "107 kg", True, 900),
                ]
            ),
            Poll(
                4,
                "How many millionaires they are in France?",
                [
                    Answer(40, " > 500", False, 1000),
                    Answer(41, " > 5 000", False, 12000),
                    Answer(42, " > 50 000", False, 1200),
                    Answer(43, " > 500 000", True, 900),
                ]
            ),
            Poll(
                5,
                "Who suffers the most after a breakup?",
                [
                    Answer(50, "The boy", True, 5000),
                    Answer(51, "The girl", False, 12000),
                ]
            )
        ]

    def find_polls(self, poll_id=False, limit=False):
        polls = self.polls
        if poll_id:
            polls = [poll for poll in polls if poll.poll_id == poll_id]
        if limit:
            polls = polls[:limit]
        return polls

    def find_polls_jsonifyed(self, poll_id=False, limit=False):
        polls = self.find_polls(poll_id=poll_id, limit=limit)
        polls_dict = [poll.__dict__.copy() for poll in polls]
        for poll_dict in polls_dict:
            poll_dict["answers"] = [answer.__dict__.copy() for answer in poll_dict["answers"]]
        polls_json = jsonify({"polls": polls_dict})
        return polls_json

    def vote(self, poll_id, answer_id):
        for poll in self.polls:
            if poll.poll_id == poll_id:
                poll.vote(answer_id)

dal = Dal()
