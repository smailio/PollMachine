/**
 * Created by anis on 13/02/17.
 */
import React from 'react';
import Header from '../containers/Header.js'
import Notifications from '../containers/Notifications.js'
import Loading  from 'react-loading';
import {connect} from 'react-redux'
import {fetch_login_status} from '../actions/index.js'

class Base extends React.Component {
    componentDidMount() {
        this.props.afterDidMount();
    }

    render() {
        return (
            <div className="container">
                <div className="row" style={{marginTop: 20, marginBottom : 20}}>
                    <div className="col">
                        <Header />
                    </div>
                </div>
                {this.props.loading &&
                    <div className="row">
                        <div className="offset-5">
                            <Loading type='balls' color='#e3e3e3'/>
                        </div>
                    </div>
                }
                {!this.props.loading && this.props.children}
                <Notifications/>
            </div>)
    }
}

export default connect(
    null,
    (dispatch) => ({afterDidMount : ()=>dispatch(fetch_login_status())})
)(Base);