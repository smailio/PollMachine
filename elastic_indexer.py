from mongodal import dal
from search import index_all

if __name__ == '__main__':
    polls = dal.find_polls()
    index_all(polls)
