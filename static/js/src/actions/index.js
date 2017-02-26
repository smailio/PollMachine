/**
 * Created by anis on 17/01/17.
 */
import axios from 'axios'
import _ from 'underscore'

export const REQUEST_POLLS = "REQUEST_POLLS";
export function request_polls() {
    return {
        type: REQUEST_POLLS
    }
}

export const RECEIVE_POLLS = "RECEIVE_POLLS";
export function receive_polls(polls, section) {
    return {
        type: RECEIVE_POLLS,
        polls,
        section
    };
}

export const REQUEST_POLL = "REQUEST_POLL";
export function request_poll(poll_id) {
    return {
        type: REQUEST_POLL,
        poll_id
    }
}

export const RECEIVE_POLL = "RECEIVE_POLL";
export function receive_poll(poll) {
    return {
        type: RECEIVE_POLL,
        poll
    }
}

export const VOTE = "VOTE";
export function vote(poll_id, answer_id) {
    return {
        type: VOTE,
        poll_id,
        answer_id
    }
}

export const REVEAL_ANSWERS = "REVEAL_ANSWERS";
export function reveal_answers(poll_id, selected_answer_id) {
    return {
        type: REVEAL_ANSWERS,
        poll_id,
        selected_answer_id
    }
}

export function fetch_polls() {
    return (dispatch, get_state) => {
        const limit = get_state().limit;
        dispatch(request_polls());
        return axios.get(
            '/api/polls',
            {
                params: {
                    limit: limit
                }
            }
        ).then((response) => {
            dispatch(receive_polls(response.data.polls, "feed"));
        }).catch((error) => {
            console.log({error})
        });
    }
}

export function fetch_poll(poll_id) {
    return dispatch => {
        dispatch(request_poll(poll_id));
        return axios.get('/api/poll/' + poll_id)
            .then((response) => {
                let polls = response.data.polls;
                if (polls.length > 0) {
                    let poll = polls[0];
                    dispatch(receive_poll(poll));
                }
            });
    }
}

export function send_vote(poll_id, answer_id, callback) {
    return dispatch => {
        return axios.post('/api/vote', {
            poll_id: poll_id,
            answer_id: answer_id
        }).then(() => {
            dispatch(reveal_answers(poll_id, answer_id));
            if (callback){
                callback();
            }
        }).catch( ({response}) => {
            switch (response.status){
                case 401:
                    dispatch(require_log_in_to_vote(poll_id));
                    break;
                case 403:
                    dispatch(show_duplicate_vote_warning(poll_id));
                    break;
                default:
                    // error during voting
                    break;
            }
        });
    };
}

export const INCREMENT_POLLS_LIMIT = "INCREMENT_POLLS_LIMIT";
export function increment_polls_limit() {
    return {
        type: INCREMENT_POLLS_LIMIT
    }
}

export const SAVE_DRAFT = "SAVE_DRAFT";
export function save_draft(changes) {
    return {
        type: SAVE_DRAFT,
        changes
    }
}

export const INVALID_DRAFT = "INVALID_DRAFT";
export function invalid_draft(errors){
    return {
        type : INVALID_DRAFT,
        errors
    }
}
export function publish() {
    return (dispatch, get_state) => {
        const {draft, user_logged_in} = get_state();
        const question = draft.question;
        const answers = draft.answers;
        const visibility = draft.visibility;
        const voters_visibility = draft.voters_visibility;
        const allow_anonymous_vote = draft.allow_anonymous_vote;
        const validate = draft => {
            const errors = {};
            if(!draft.question){
                errors.question = "Required";
            }
            if(draft.answers.length < 2){
                errors.answers = "At least two answers";
            }
            const count_empty_answers = draft.answers.filter( (answer) => answer.text == '').length;
            if(count_empty_answers > 1){
                errors.answers = "Not more than one empty answer";
            }
            if(voters_visibility == "me" && !user_logged_in){
                errors.log_in_required = true;
            }
            return errors;
        };
        const errors = validate(draft);
        if(!_.isEmpty(errors)){
            dispatch(invalid_draft(errors));
            return ;
        }
        axios.post('/api/publish', {
            question,
            answers,
            visibility,
            voters_visibility,
            allow_anonymous_vote
        }).then(() => {
            dispatch(notify_publish_success())
        }).catch(() => {
            dispatch(notify_publish_failure())
        })
    }
}

export const REMOVE_DRAFT_ANSWER = "REMOVE_DRAFT_ANSWER";
export function remove_draft_answer(answer_index) {
    return {
        type: REMOVE_DRAFT_ANSWER,
        answer_index
    }
}

export const SHOW_PUBLISH_SUCCESS = "SHOW_PUBLISH_SUCCESS";
export function show_publish_success_notification() {
    return {
        type: SHOW_PUBLISH_SUCCESS
    }
}

export const HIDE_PUBLISH_SUCCESS = "HIDE_PUBLISH_SUCCESS";
export function hide_publish_success_notification() {
    return {
        type : HIDE_PUBLISH_SUCCESS
    }
}


export const SHOW_PUBLISH_FAILURE = "SHOW_PUBLISH_FAILURE";
export function show_publish_failure_notification() {
    return {
        type: SHOW_PUBLISH_FAILURE
    }
}

export const HIDE_PUBLISH_FAILURE = "HIDE_PUBLISH_FAILURE";
export function hide_publish_failure_notification() {
    return {
        type : HIDE_PUBLISH_FAILURE
    }
}

export const EMPTY_DRAFT = "EMPTY_DRAFT";
export function empty_draft(){
    return {
        type : EMPTY_DRAFT
    }
}

export function notify_publish_success(){
    return (dispatch) => {
        dispatch(show_publish_success_notification());
        dispatch(empty_draft());
        setTimeout(() => dispatch(hide_publish_success_notification()), 2000);
    }
}

export function notify_publish_failure(){
    return (dispatch) => {
        dispatch(show_publish_failure_notification());
        setTimeout(() => dispatch(hide_publish_failure_notification()), 2000);
    }
}

export const REQUIRE_LOG_IN_TO_VOTE = "REQUIRE_LOG_IN_TO_VOTE";
export function require_log_in_to_vote(poll_id){
    return {
        type: REQUIRE_LOG_IN_TO_VOTE,
        poll_id
    }
}

export const SHOW_DUPLICATE_VOTE_WARNING = "SHOW_DUPLICATE_VOTE_WARNING";
export function show_duplicate_vote_warning(poll_id){
    return {
        type : SHOW_DUPLICATE_VOTE_WARNING,
        poll_id
    }
}

export function fetch_created_polls(){
    return (dispatch) => {
        dispatch(request_polls());
        return axios.get(
            '/api/polls/mine'
        ).then((response) => {
            dispatch(receive_polls(response.data.polls, "mine"));
        }).catch((error) => {
            console.log({error})
        });
    }
}

export function fetch_login_status(){
    return (dispatch) =>{
        return axios
            .get('/api/user/login_status')
            .then((response) => dispatch(receive_user_status(response.data.logged_in)));
    };
}

export const RECEIVE_LOGIN_STATUS = "RECEIVE_LOGIN_STATUS";
export function receive_user_status(logged_in){
    return {
        type : RECEIVE_LOGIN_STATUS,
        logged_in : logged_in
    }
}