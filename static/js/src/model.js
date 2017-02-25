/**
 * Created by anis on 01/11/16.
 */

import axios from 'axios'

export function vote(poll_id, answer_id, callback) {
    let CancelToken = axios.CancelToken;
    let vote_cancel = null;
    axios.post('/api/vote',{
            poll_id: poll_id,
            answer_id: answer_id,
            cancelToken: new CancelToken((c) => {
                vote_cancel = (text) => {
                    console.log("CANCELING VOTE");
                    c(text);
                };
            })
    }).then((response) => {
        console.log("VOTED");
        console.log(response);
        if (callback) {
            callback();
        }
    }).catch(function (thrown) {
        if (axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message);
        }
    });
    return vote_cancel;
}

export function load_poll(poll_id, callback) {
    let CancelToken = axios.CancelToken;
    let cancel_load_poll = null;
    axios.get('/api/poll/' + poll_id, {
        cancelToken: new CancelToken((c) => {
            cancel_load_poll = (text) => {
                    console.log("CANCEL LOAD POLL");
                    c(text);
            };
        })
    })
        .then((response) => {
            console.log("LOAD POLL");
            console.log(response);
            let polls = response.data.polls;
            console.log(polls);
            if (polls.length > 0) {
                let poll = polls[0];
                console.log(poll);
                callback(poll);
            }
        }).catch(function (thrown) {
        if (axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message);
        }
    });
    return cancel_load_poll;
}

export function load_more_polls(limit, callback) {
    let CancelToken = axios.CancelToken;
    let cancel_load_more_polls = null;
    axios.get(
        '/api/polls',
        {
            params: {
                limit: limit
            },
            cancelToken: new CancelToken((c) => {
                cancel_load_more_polls = (text) => {
                    console.log("CANCELING LOAD MORE POLLS");
                    c(text);
                };
            })
        }
    ).then((response) => {
        console.log("LOAD MORE POLLS");
        console.log(response.data);
        callback(response.data);
    }).catch(function (thrown) {
        if (axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message);
        }
    });
    return cancel_load_more_polls;
}