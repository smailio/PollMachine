/**
 * Created by anis on 25/01/17.
 */
import {polls} from './index.js'
import * as actions from '../actions/index.js'

describe('reducer', ()=>{
    it("should handle REQUEST_POLLS ", () => {
        let next_state = polls(undefined, actions.request_polls());
        expect(next_state).toEqual({
            is_fetching_polls: true
        });

        expect(polls({polls: [{}, {}]}, actions.request_polls()))
            .toEqual({is_fetching_polls: true, polls: [{}, {}]});

        expect(polls({is_fetching_polls: false, polls: [{}]}, actions.request_polls()))
            .toEqual({is_fetching_polls: true, polls: [{}]});

        expect(polls({is_fetching_polls: false, polls: [{}]}, actions.request_polls()))
            .toEqual({is_fetching_polls: true, polls: [{}]});
    });
    it("should handle RECEIVE_POLLS ", () => {

        expect(polls(
            {
                is_fetching_polls: true,
                polls: {3: {poll_id: 3, question: '', answers: []}}
            },
            {
                type: actions.RECEIVE_POLLS,
                polls: [{poll_id: 4, question: '', answers: []}]
            }))
            .toEqual({
                is_fetching_polls: false,
                polls: {
                    3: {poll_id: 3, question: '', answers: []},
                    4: {poll_id: 4, question: '', answers: []}
                }
            });
    });
    it("should handle REVEAL_ANSWERS ", () =>{
        expect(polls(
            {
                is_fetching_polls : false,
                polls : {3 : {poll_id : 3, question : '', answers : []},
                         4 : {poll_id : 4, question : '', answers : []}
}
            },
            {
                type : actions.REVEAL_ANSWERS,
                selected_answer_id : 2,
                poll_id : 3
            }))
            .toEqual({
                is_fetching_polls : false,
                polls : {
                    3 : {answered : true, selected_answer_id : 2, poll_id : 3, question : '', answers : []},
                    4 : {poll_id : 4, question : '', answers : []}
                }
            });
    });
});