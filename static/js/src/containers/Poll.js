/**
 * Created by anis on 06/02/17.
 */
import Poll from '../components/Poll.jsx'
import {connect} from 'react-redux'
import {send_vote} from '../actions/index.js'

export default connect(
    (state) => {return {poll : state.poll} },
    (dispatch) => {return {vote : (poll_id, answer_id) => dispatch(send_vote(poll_id, answer_id))} }
)(Poll);
