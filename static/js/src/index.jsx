/**
 * Created by anis on 08/01/17.
 */
import React from 'react';
import {render} from 'react-dom';
import {Router, Route, hashHistory, Link} from 'react-router'
import PollMachine from './views/Home.jsx'
import SinglePoll from './views/SinglePoll.jsx'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import reducer from './reducers/index.js'
import createLogger from 'redux-logger'
import CreatePollFormContainer from './containers/CreatePollForm.js'

class App extends React.Component {
    render() {
        return (
            <Router history={hashHistory}>
                <Route path="/" component={PollMachine}/>
                <Route path="/poll/:poll_id" component={SinglePoll}/>
                <Route path="/mine" component={PollMachine}/>
                <Route path="/answers" component={PollMachine}/>
                <Route path="/create" component={CreatePollFormContainer}/>
            </Router>
        );
    }
}

App.PropTypes = {
    username: React.PropTypes.isRequired,
    poll_id: React.PropTypes.string
};

const middleware = [ thunk, createLogger() ];

const store = createStore(
    reducer,
    applyMiddleware(...middleware));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);