from elasticsearch_dsl import Completion
from elasticsearch_dsl import Date
from elasticsearch_dsl import DocType
from elasticsearch_dsl import String
from elasticsearch_dsl import Text
from elasticsearch_dsl import Keyword
from elasticsearch_dsl import Q
from elasticsearch_dsl.connections import connections
from elasticsearch_dsl import Search

connections.create_connection(hosts=['http://elastic:changeme@localhost:9200'])


def search(author_id, keywords):
    s = Search(index='trydemocracy')
    query = Q("multi_match", fields=["answers.text", "question"], query=keywords, fuzziness="AUTO") & \
        Q("term", author_id=author_id)
    response = s.query(query)
    hits = [hit for hit in response]
    return hits


class Poll(DocType):
    question = Text()
    type = Text()
    author_id = String()
    db_id = String()
    question_suggest = Completion(payloads=True)
    created_at = Date()
    answers = Text(
        fields={'raw': Keyword()}
    )

    class Meta:
        index = 'trydemocracy'


def index(poll):
    elastic_poll = Poll(**poll)
    elastic_poll.save()


def index_all(polls):
    """

    :param polls: List
    :return:
    """
    for poll in polls:
        elastic_poll = Poll(**{
            "author_id": poll["author_id"],
            "question": poll["question"],
            "answers": [{"text": answer["text"]} for answer in poll["answers"]],
            "db_id": poll["poll_id"]
        })

        print({
            "author_id": poll["author_id"],
            "question": poll["question"],
            "answers": [answer["text"] for answer in poll["answers"]],
            "db_id": poll["poll_id"]
        })
        elastic_poll.save()
