/**
 * Created by anis on 02/03/17.
 */
import SearchForm from '../components/SearchForm.jsx'
import {connect} from 'react-redux'
import {search_in_mine, save_search_text} from '../actions/index.js'
import _ from 'underscore'

const dispatch_search = _.debounce((dispatch, new_text) => dispatch(search_in_mine(new_text)), 200);

export default connect(
    (state) => ({text: state.search.text}),
    (dispatch) => ({
        handle_search_text_change: (new_text) => {
            dispatch(save_search_text(new_text));
            dispatch_search(dispatch, new_text);
        }
    })
)(SearchForm);