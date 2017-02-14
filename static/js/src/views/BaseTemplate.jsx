/**
 * Created by anis on 13/02/17.
 */
import React from 'react';
import Header from '../containers/Header.js'
import Notifications from '../containers/Notifications.js'

export default class Base extends React.Component {
    componentDidMount() {
        // this._notificationSystem = this.refs.notificationSystem;
    }

    render() {
        return (
            <div className="container">
                {/*<NotificationSystem ref="notificationSystem" />*/}
                <div className="row" style={{marginTop: 20}}>
                    <div className="col">
                        <Header />
                    </div>
                </div>
                {this.props.children}
                <Notifications/>
            </div>)
    }
}