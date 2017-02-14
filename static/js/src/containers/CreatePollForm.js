/**
 * Created by anis on 09/02/17.
 */
import CreatePollForm from '../components/CreatePollForm.jsx'
import {connect} from 'react-redux'
import {publish, save_draft, remove_draft_answer} from '../actions/index.js'
export default connect(
    (state) => {console.log({"STATE_CREAT_POLL_FORM" : state}); return { question : state.draft.question, answers : state.draft.answers}},
    (dispatch) => ({
        save : (changes) => dispatch(save_draft(changes)),
        publish : () => dispatch(publish()),
        remove_answer : (answer_index) => dispatch(remove_draft_answer(answer_index))
    })
)(CreatePollForm);