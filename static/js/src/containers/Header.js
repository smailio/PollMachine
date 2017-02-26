/**
 * Created by anis on 13/02/17.
 */
import Header from '../components/Header.jsx'
import {connect} from 'react-redux'

export default connect(
    (state) => ({logged_in : state.user_logged_in}),
    null
)(Header);