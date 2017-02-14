/**
 * Created by anis on 06/02/17.
 */
import PollList from '../components/PollList.jsx'
import {connect} from 'react-redux'
import {fetch_polls, increment_polls_limit, send_vote} from '../actions/index.js'

export default connect(
    (state, own_props) => ({
        polls : state.polls,
        limit : state.limit}),
    (dispatch) => ({
            vote : (poll_id, answer_id) => {
                    dispatch(increment_polls_limit());
                    dispatch(send_vote(poll_id, answer_id));
                    dispatch(fetch_polls())}})
)(PollList);
