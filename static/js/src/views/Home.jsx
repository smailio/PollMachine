/**
 * Created by anis on 08/01/17.
 */

import React from 'react';
import Feed from '../containers/PollList.js'
import {Router, Route, hashHistory, Link} from 'react-router'
import {connect} from 'react-redux'
import {fetch_polls} from '../actions/index.js'
import _ from 'underscore'
import Base from './BaseTemplate.jsx'

export class PollMachine extends React.Component {

    constructor() {
        super();
    }

    componentDidMount() {
        this.props.afterDidMount();
    }

    render() {
        if (this.props.polls_empty) {
            return <Base loading={true} />
        }
        return (
            <Base>
                <Feed />
            </Base>)
    }
}

PollMachine.propTypes = {
    afterDidMount: React.PropTypes.func.isRequired
};

export default connect(
    (state, own_props) => ({polls_empty : _.isEmpty(state.feed) }),
    (dispatch) => ({ afterDidMount : () => dispatch(fetch_polls()) })
)(PollMachine);