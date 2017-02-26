/**
 * Created by anis on 08/01/17.
 */
import React from 'react';
import {render} from 'react-dom';
import {Router, Route, hashHistory, Link, Redirect} from 'react-router'
import PollMachine from './views/Home.jsx'
import Mine from './views/Mine.jsx'
import SinglePoll from './views/SinglePoll.jsx'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'
import reducer from './reducers/index.js'
import createLogger from 'redux-logger'
import CreatePollFormContainer from './containers/CreatePollForm.js'
import Login from './views/Login.jsx'
import axios from 'axios'

const middleware = [thunk, createLogger()];

const store = createStore(
    reducer,
    applyMiddleware(...middleware));

function redirect_anonymous_user(nextState, replace, callback) {
    axios
        .get('/api/user/login_status')
        .then((response) => {
            if (!response.data.logged_in) {
                replace('/log_in');
            }
            callback();
    })
}

class App extends React.Component {
    render() {
        return (
            <Router history={hashHistory}>
                <Route path="/" component={PollMachine}/>
                <Redirect from="/_=_" to="/mine"/>
                <Route path="/poll/:poll_id" component={SinglePoll}/>
                <Route path="/mine" component={Mine} onEnter={redirect_anonymous_user}/>
                <Route path="/answers" component={PollMachine}/>
                <Route path="/log_in" component={Login}/>
                <Route path="/create" component={CreatePollFormContainer}/>
            </Router>
        );
    }
}

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);