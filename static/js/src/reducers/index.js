/**
 * Created by anis on 17/01/17.
 */
import {
    REQUEST_POLLS, RECEIVE_POLLS, REVEAL_ANSWERS,
    INCREMENT_POLLS_LIMIT, REQUEST_POLL, RECEIVE_POLL,
    SAVE_DRAFT, EMPTY_DRAFT, REMOVE_DRAFT_ANSWER,
    INVALID_DRAFT, SHOW_PUBLISH_SUCCESS, HIDE_PUBLISH_SUCCESS,
    SHOW_PUBLISH_FAILURE, HIDE_PUBLISH_FAILURE, REQUIRE_LOG_IN_TO_VOTE,
    SHOW_DUPLICATE_VOTE_WARNING
} from '../actions/index'
import _ from 'underscore'

const INITIAL_STATE = {
    loading: true,
    limit: 1,
    polls: {},
    feed: [],
    mine: [],
    draft: {
        question: "",
        answers: [{text: "", correct: false}, {text: "", correct: false}],
        visibility: "public",
        voters_visibility: "nobody",
        allow_anonymous_vote: true,
        errors: {}
    },
    is_fetching_polls: false,
    user_logged_in: false,
    notifications: {
        show_publish_success: false,
        show_publish_failure: false
    }
};

function toggle_visibility(visibility) {
    if (visibility == "public") {
        return "shareable_by_link";
    }
    else {
        return "public"
    }
}
/**
 *
 * @param state
 * @param action
 * @returns {*}
 */
const poll = (state = {}, action) => {
    switch (action.type) {
        case REVEAL_ANSWERS:
            if (action.poll_id != state.poll_id) {
                return state;
            }
            return {
                answered: true,
                selected_answer_id: action.selected_answer_id,
                ...state
            };
        case REQUIRE_LOG_IN_TO_VOTE:
            return {
                ...state,
                log_in_required: true
            };
        case SHOW_DUPLICATE_VOTE_WARNING:
            return {
                ...state,
                show_duplicate_vote_warning: true
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
    switch (action.type) {
        case REQUEST_POLLS:
            return {
                ...state,
                is_fetching_polls: true
            };
        case RECEIVE_POLLS:
            let next_polls = Object.assign({}, state.polls);
            let next_poll_ids = [];
            let section = state[action.section];
            for (let next_poll of action.polls) {
                const already_answered = (state.polls &&
                state.polls[next_poll.poll_id] &&
                state.polls[next_poll.poll_id].answered == true);
                if (already_answered)
                    next_poll.answered = true;
                next_polls = Object.assign({}, next_polls, {[next_poll.poll_id]: next_poll});
                next_poll_ids.push(next_poll.poll_id);
            }
            next_poll_ids = _.uniq([...section, ...next_poll_ids]);
            return {
                ...state,
                is_fetching_polls: false,
                polls: next_polls,
                [action.section]: next_poll_ids
            };
        case REVEAL_ANSWERS:
            if (!state.polls[action.poll_id]) {
                console.error('try answer a poll not loaded yet, poll id : ' + action.poll_id);
                return state;
            }
            let polls_after_reveal_answers = Object.assign(
                {},
                state.polls,
                {
                    [action.poll_id]: poll(state.polls[action.poll_id], action)
                });

            return {
                ...state,
                polls: polls_after_reveal_answers
            };
        case RECEIVE_POLL:
            let _poll = action.poll;
            let _poll_id = _poll.poll_id;
            const already_answered = (_.has(state.polls, _poll_id) && state.polls[_poll_id].answered == true);
            if (already_answered) {
                _poll.answered = true;
            }
            return {
                ...state,
                polls: {
                    ...state.polls,
                    [_poll_id]: _poll
                }
            };
        case REQUIRE_LOG_IN_TO_VOTE:
            return {
                ...state,
                polls: {
                    ...state.polls,
                    [action.poll_id]: poll(state.polls[action.poll_id], action)
                }
            };
        case SHOW_DUPLICATE_VOTE_WARNING:
            return {
                ...state,
                polls: {
                    ...state.polls,
                    [action.poll_id]: poll(state.polls[action.poll_id], action)
                }
            };
        default:
            return state;

    }
};

function draft(state = INITIAL_STATE, action) {
    switch (action.type) {
        case SAVE_DRAFT:
            let changes = action.changes;
            if (_.has(changes, "question")) {
                return {
                    ...state,
                    draft: {
                        ...state.draft,
                        question: changes.question.text
                    }
                }
            }
            else if (_.has(changes, 'answer')) {
                if (_.has(changes.answer, 'new')) {
                    return {
                        ...state,
                        draft: {
                            ...state.draft,
                            answers: [...state.draft.answers, {text: "", correct: false}]
                        }
                    }
                }
                return {
                    ...state,
                    draft: {
                        ...state.draft,
                        answers: state.draft.answers.map((answer, i) => {
                            if (changes.answer.index == i) {
                                return {...answer, ...changes.answer}
                            }
                            else
                                return answer
                        })
                    }
                }
            }
            else if (_.has(changes, "visibility")) {
                return {
                    ...state,
                    draft: {
                        ...state.draft,
                        visibility: toggle_visibility(state.draft.visibility)
                    }
                }
            }
            else if (_.has(changes, "voters_visibility")) {
                return {
                    ...state,
                    draft: {
                        ...state.draft,
                        voters_visibility: changes.voters_visibility
                    }
                }
            }
            else if (_.has(changes, "allow_anonymous_vote")) {
                return {
                    ...state,
                    draft: {
                        ...state.draft,
                        allow_anonymous_vote: !state.draft.allow_anonymous_vote,
                        /*
                         * when anonymous vote is allowed, voters_visibility value is "nobody", when
                         * not allowed, voters_visibility default value is "me".
                         */
                        voters_visibility: (!state.draft.allow_anonymous_vote)? "nobody" : "me"
                    }
                }
            }
            else {
                return state;
            }
        case REMOVE_DRAFT_ANSWER:
            const answer_index = action.answer_index;
            console.log(state.draft.answers.filter((answer, i) => i != answer_index));
            return {
                ...state,
                draft: {
                    ...state.draft,
                    answers: state.draft.answers.filter((answer, i) => i != answer_index)
                }
            };
        case EMPTY_DRAFT:
            return {...state, draft: INITIAL_STATE.draft};
        case INVALID_DRAFT:
            const errors = action.errors;
            return {...state, draft: {...state.draft, errors}};
        default:
            return state;
    }
}

function notifications(state = INITIAL_STATE.notifications, action) {
    switch (action.type) {
        case SHOW_PUBLISH_SUCCESS:
            return {
                ...state,
                show_publish_success: true,
            };
        case HIDE_PUBLISH_SUCCESS:
            return {
                ...state,
                show_publish_success: false
            };
        case SHOW_PUBLISH_FAILURE:
            return {
                ...state,
                show_publish_failure: true,
            };
        case HIDE_PUBLISH_FAILURE:
            return {
                ...state,
                show_publish_failure: false
            };
        default:
            return state;

    }
}

function reducers(state = INITIAL_STATE, action) {
    switch (action.type) {
        case REQUEST_POLL:
        case RECEIVE_POLL:
        case REQUEST_POLLS:
        case REVEAL_ANSWERS:
        case REQUIRE_LOG_IN_TO_VOTE:
        case SHOW_DUPLICATE_VOTE_WARNING:
            return polls(state, action);
        case RECEIVE_POLLS:
            const next = Object.assign({}, state, {loading: false});
            return polls(next, action);
        case INCREMENT_POLLS_LIMIT:
            const new_limit = state.limit + 1;
            return Object.assign({}, state, {limit: new_limit});
        case SAVE_DRAFT:
        case EMPTY_DRAFT:
        case REMOVE_DRAFT_ANSWER:
        case INVALID_DRAFT:
            return draft(state, action);
        case SHOW_PUBLISH_SUCCESS:
        case HIDE_PUBLISH_SUCCESS:
        case SHOW_PUBLISH_FAILURE:
        case HIDE_PUBLISH_FAILURE:
            return {...state, notifications: notifications(state.notifications, action)};
        default:
            return state;
    }
}

export default reducers;