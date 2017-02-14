/**
 * Created by anis on 13/02/17.
 */
import React from 'react'
import NotificationSystem from 'react-notification-system';

export default class Notifications extends React.Component {

    componentDidMount() {
        const notifications = this.props.notifications;
        let notification_system = this.refs.notification_system;
        dispatch_notifications(notifications, notification_system);
    }

    componentWillUpdate(props) {
        const notifications = props.notifications;
        let notification_system = this.refs.notification_system;
        dispatch_notifications(notifications, notification_system);
    }

    render() {
        return <NotificationSystem ref="notification_system"/>
    }
}

Notifications.propTypes = {
    notifications: React.PropTypes.shape({
        show_publish_success: React.PropTypes.bool
    })
};

function dispatch_notifications(notifications, notification_system) {
    if (notifications.show_publish_success) {
        notification_system.addNotification({
            message: 'Publish succeed ! ',
            level: 'success',
            autoDismiss: 2,
            position: 'bc'
        });
    }
}