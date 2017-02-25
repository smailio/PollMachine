/**
 * Created by anis on 13/02/17.
 */
import Header from '../components/Header.jsx'
import {connect} from 'react-redux'

export default connect(
    (state) => ({publish_notification : state.notifications.show_publish_success}),
    null
)(Header);