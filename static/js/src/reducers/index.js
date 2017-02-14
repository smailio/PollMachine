/**
 * Created by anis on 17/01/17.
 */
import {REQUEST_POLLS, RECEIVE_POLLS, REVEAL_ANSWERS,
    INCREMENT_POLLS_LIMIT, REQUEST_POLL, RECEIVE_POLL,
    SAVE_DRAFT, EMPTY_DRAFT, REMOVE_DRAFT_ANSWER,
    SHOW_PUBLISH_SUCCESS, HIDE_PUBLISH_SUCCESS} from '../actions/index'
import _ from 'underscore'

const INITIAL_STATE = {
    loading : true,
    limit : 1,
    polls : {},
    draft : {question : "", answers : [{text : "", correct : false}, {text : "", correct : false}] },
    is_fetching_polls : false,
    notifications : {
        show_publish_success : false,
    }
};

/**
 *
 * @param state
 * @param action
 * @returns {*}
 */
const poll = (state={}, action) =>{
    switch(action.type){
        case REVEAL_ANSWERS:
            if(action.poll_id != state.poll_id){
                return state;
            }
            return {
                answered : true,
                selected_answer_id : action.selected_answer_id,
                ...state
            };
        default:
            return state;
    }
};

/**
 *
 * @param state is the state object
 * @param action is the action object
 * @returns {*}
 */
export const polls = (state = {}, action) => {
    switch(action.type){
        case REQUEST_POLLS:
            return {
                ...state,
                is_fetching_polls : true
            };
        case RECEIVE_POLLS:
            let next_polls = Object.assign({}, state.polls);
            for(let next_poll of action.polls){
                const already_answered = (state.polls &&
                    state.polls[next_poll.poll_id] &&
                    state.polls[next_poll.poll_id].answered == true);
                if(already_answered)
                    next_poll.answered = true;
                next_polls = Object.assign({}, next_polls, {[next_poll.poll_id]: next_poll});
            }
            return {
                ...state,
                is_fetching_polls : false,
                polls : next_polls
            };
        case REVEAL_ANSWERS:
            if(!state.polls[action.poll_id]){
                console.error('try answer a poll not loaded yet, poll id : ' + action.poll_id);
                return state;
            }
            let polls_after_reveal_answers = Object.assign(
                {},
                state.polls,
                {
                    [action.poll_id] : poll(state.polls[action.poll_id], action)
                });

            return {
                ...state,
                polls : polls_after_reveal_answers
            };
        case RECEIVE_POLL:
            let _poll = action.poll;
            let _poll_id = _poll.poll_id;
            const already_answered = (_.has(state.polls, _poll_id) && state.polls[_poll_id].answered == true);
            if(already_answered){
                _poll.answered = true;
            }
            return {
                ...state,
                polls : {
                    ...state.polls,
                    [_poll_id] : _poll
                }
            };
        default:
            return state;

    }
};

function draft(state = INITIAL_STATE, action){
    switch (action.type){
        case SAVE_DRAFT:
            let changes = action.changes;
            if (_.has(changes, "question") ){
                return {
                    ...state,
                    draft : {
                        ...state.draft,
                        question : changes.question.text
                    }
                }
            }
            else if( _.has(changes, 'answer')){
                if(_.has(changes.answer, 'new')){
                    return {
                        ...state,
                        draft: {
                            ...state.draft,
                            answers: [...state.draft.answers, {text : "", correct : false}]
                        }
                    }
                }
                return {
                    ...state,
                    draft: {
                        ...state.draft,
                        answers: state.draft.answers.map( (answer, i) => {
                            if(changes.answer.index == i){
                                return {...answer, ...changes.answer}
                            }
                            else
                                return answer
                        })
                    }
                }
            }
            else {
                return state;
            }
        case REMOVE_DRAFT_ANSWER:
            const answer_index = action.answer_index;
            console.log(state.draft.answers.filter((answer, i) => i!= answer_index));
            return {
                ...state,
                draft : {
                    ...state.draft,
                    answers : state.draft.answers.filter((answer, i) => i!= answer_index)
                }
            };
        case EMPTY_DRAFT:
            return {...state, draft : INITIAL_STATE.draft};
        default:
            return state;
    }
}

function notifications(state = INITIAL_STATE.notifications, action){
    switch(action.type){
        case SHOW_PUBLISH_SUCCESS:
            return {
                ...state,
                show_publish_success : true,
            };
        case HIDE_PUBLISH_SUCCESS:
            return {
                ...state,
                show_publish_success: false
            };
        default:
            return state;

    }
}

function reducers(state = INITIAL_STATE, action) {
    switch (action.type){
        case REQUEST_POLL:
        case RECEIVE_POLL:
        case REQUEST_POLLS:
        case REVEAL_ANSWERS:
            return polls(state, action);
        case RECEIVE_POLLS:
            const next = Object.assign({}, state, {loading : false});
            return polls(next, action);
        case INCREMENT_POLLS_LIMIT:
            const new_limit = state.limit + 1;
            return Object.assign({}, state, {limit : new_limit});
        case SAVE_DRAFT:
        case EMPTY_DRAFT:
        case REMOVE_DRAFT_ANSWER:
            return draft(state, action);
        case SHOW_PUBLISH_SUCCESS:
        case HIDE_PUBLISH_SUCCESS:
            return {...state, notifications : notifications(state.notifications, action)};
        default:
            return state;
    }
}

export default reducers;