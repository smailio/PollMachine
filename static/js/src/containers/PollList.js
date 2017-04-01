/**
 * Created by anis on 06/02/17.
 */
import PollList from '../components/PollList.jsx'
import {connect} from 'react-redux'
import {fetch_polls, fetch_poll, increment_polls_limit, send_vote} from '../actions/index.js'
import _ from 'underscore'

const Feed = connect(
    (state, own_props) => ({
        polls: _.object(_.map(state.feed, (poll_id) => [poll_id, state.polls[poll_id]])),
        limit: state.limit
    }),
    (dispatch) => ({
        vote: (poll_id, answer_id) => {
            dispatch(increment_polls_limit());
            dispatch(send_vote(poll_id, answer_id, () => {
                dispatch(fetch_polls());
                dispatch(fetch_poll(poll_id))
            }));
        }
    })
)(PollList);
export default Feed;

export const MyPolls = connect(
    (state, own_props) => ({
        polls: _.object(_.map(state.mine, (poll_id) => [poll_id, state.polls[poll_id]])),
    }),
    (dispatch) => ({
        vote: (poll_id, answer_id) => {
            dispatch(send_vote(poll_id, answer_id, () => {
                dispatch(fetch_poll(poll_id))
            }));
        }
    })
)(PollList);

export const SearchResult = connect(
    (state, own_props) => ({ polls: state.search.result}),
    (dispatch) => ({
        vote: (poll_id, answer_id) => {
            dispatch(send_vote(poll_id, answer_id, () => {
                dispatch(fetch_poll(poll_id))
            }));
        }
    })
)(PollList);