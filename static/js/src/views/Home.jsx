/**
 * Created by anis on 08/01/17.
 */

import React from 'react';
import Loading  from 'react-loading';
import PollListContainer from '../containers/PollList.js'
import {Router, Route, hashHistory, Link} from 'react-router'
import {connect} from 'react-redux'
import {fetch_polls} from '../actions/index.js'
import _ from 'underscore'
import Base from './BaseTemplate.jsx'

class PollMachine extends React.Component {

    constructor() {
        super();
    }

    componentDidMount() {
        this.props.afterDidMount();
    }

    render() {
        if (this.props.polls_empty) {
            return (
                <Base>
                    <div className="row">
                        <div className="offset-5">
                            <Loading type='balls' color='#e3e3e3'/>
                        </div>
                    </div>
                </Base>)
        }
        return (
            <Base>
                <div style={{marginTop : 20}}></div>
                <PollListContainer />
            </Base>)
    }
}

PollMachine.propTypes = {
    afterDidMount: React.PropTypes.func.isRequired
};

export default connect(
    (state, own_props) => ({polls_empty : _.isEmpty(state.polls) }),
    (dispatch) => ({ afterDidMount : () => dispatch(fetch_polls()) })
)(PollMachine);