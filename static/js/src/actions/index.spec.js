/**
 * Created by anis on 25/01/17.
 */

import * as actions from '../actions/index.js'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import moxios from 'moxios'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; // 10 second timeout

describe('actions', () => {
    it('should create an action to receive polls', () => {
        expect(actions.receive_polls([{poll_id: 2}]))
            .toEqual(
                {
                    type: actions.RECEIVE_POLLS,
                    polls: [{poll_id: 2}]
                }
            )
    });

    it('should create an action to request poll', () => {
        expect(actions.request_polls([{poll_id: 2}]))
            .toEqual({type: actions.REQUEST_POLLS})
    });

    it('should create an action to vote', () => {
        expect(actions.vote(1, 3))
            .toEqual({type: actions.VOTE, poll_id: 1, answer_id: 3})
    });
});

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('async actions', () => {
    beforeEach(function () {
        // import and pass your custom axios instance to this method
        moxios.install()
    });

    afterEach(function () {
        // import and pass your custom axios instance to this method
        moxios.uninstall()
    });

    it('creates RECEIVE_POLLS when fetching polls has been done', (done) => {
        moxios.stubRequest('/api/polls?limit=4', {
            status: 200,
            response: {polls: [{}, {}, {}, {}, {}]}
        });
        const expected_actions = [
            {type: actions.REQUEST_POLLS},
            {type: actions.RECEIVE_POLLS, polls: [{}, {}, {}, {}, {}]}
        ];

        let actions_dispatched = [];
        actions.fetch_polls()( (action) => {
            actions_dispatched.push(action)
        },
            () => ({limit : 4}));
        moxios.wait(function () {
            try{
                expect(actions_dispatched).toEqual(expected_actions);
            }
            catch(e) {
                done.fail(e);
            }
            done();
        });
    });

    // it('creates FETCH_POLL when send_vote is dispatched', (done) => {
    //     moxios.stubRequest('/api/vote', {
    //         status: 200,
    //         response: {}
    //     });
    // });
});