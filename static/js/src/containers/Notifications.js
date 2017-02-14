/**
 * Created by anis on 13/02/17.
 */
import Notifications from '../components/Notifications.jsx'
import {connect} from 'react-redux'

export default connect(
    (state) => ({notifications : state.notifications}),
    null
)(Notifications);