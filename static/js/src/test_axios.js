/**
 * Created by anis on 27/11/16.
 */
import React from 'react';
import {render} from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Loading  from 'react-loading';
import {Router, Route, hashHistory, Link} from 'react-router'
import axios from 'axios'

function vote(poll_id, answer_id, callback) {
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

function load_poll(poll_id, callback) {
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
            console.log(polls);
            if (polls.length > 0) {
                callback(poll);
            }
        }).catch(function (thrown) {
        if (axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message);
        }
    });
    return cancel_load_poll;
}

function load_more_polls(limit, callback) {
    let CancelToken = axios.CancelToken;
    let cancel_load_more_polls = null;
    axios.get(
        '/api/polls',
        {
            cancelToken: new CancelToken((c) => {
                cancel_load_more_polls = (text) => {
                    console.log("CANCELING LOAD MORE POLLS");
                    c(text);
                };
            })
        }
    ).then((response) => {
        console.log("LOAD MORE POLLS");
        callback(response.data);
    }).catch(function (thrown) {
        if (axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message);
        }
    });
    return cancel_load_more_polls;
}

function make_dumb_request(callback) {
    let CancelToken = axios.CancelToken;
    let cancel_dumb_request = null;

    axios.get('/api/dumb_request', {
        cancelToken: new CancelToken((c) => {
            cancel_dumb_request = (text) => {
                console.log("CANCEL DUMB REQUEST");
                console.log(CancelToken);
                c(text);
            };
        })
    })
        .then((response) => {
            console.log("DUMB RESPONSE");
            let message = response.data.message;
            console.log(message);
            if (callback) {
                callback();
            }
        }).catch(function (thrown) {
        if (axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message);
        }
    });
    return cancel_dumb_request;
}


class DumbApp extends React.Component {
    constructor() {
        super();
        this.state = {
            show_component: false
        };
        this.toggleShowComponentFlag = this.toggleShowComponentFlag.bind(this);
    }

    toggleShowComponentFlag() {
        this.setState({
            show_component: !this.state.show_component
        });
    }

    render() {
        return (
            <Router history={hashHistory}>
                <Route path="/" component={LinkToDumbComponent}/>
                <Route path="/show" component={DumbComponent}/>
            </Router>
        );
    }
}
class LinkToDumbComponent extends React.Component {
    render() {
        return (
            <div>
                <Link
                    style={{color : "black"}}
                    to="/show">
                    show dumb component
                </Link>
            </div>
        )
    }
}

class DumbComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            api_call_count: 0
        };
        this.cancel_request_functions = [];

        this.make_dumb_request = this.make_dumb_request.bind(this);
        this.cancel_all_requests = this.cancel_all_requests.bind(this);
    }

    make_dumb_request() {
        let updateApiCallCount = () => {
            this.setState({api_call_count: this.state.api_call_count + 1});
        };
        let cancel = make_dumb_request(updateApiCallCount);
        this.cancel_request_functions.push(cancel)
    }

    componentWillUnmount() {
        console.log("COMPONENT WILL UNMOUNT");
        this.cancel_all_requests();
    }

    cancel_all_requests() {
        console.log(this.cancel_request_functions);
        for (let i = 0; i < this.cancel_request_functions.length; i++) {
            let cancel = this.cancel_request_functions[i];
            cancel();
        }
    }

    render() {
        return <div>
            <h5>api call count : {this.state.api_call_count}</h5>
            <button onClick={this.make_dumb_request}>make dumb request</button>
            <button onClick={this.cancel_all_requests}>cancel all requests</button>
            <Link
                style={{color : "black"}}
                to="/">
                hide dumb component
            </Link>
        </div>
    }
}

render(<DumbApp />, document.getElementById('app'));