/**
 * Created by anis on 24/02/17.
 */
import {connect} from 'react-redux'
import {fetch_created_polls} from '../actions/index.js'
import _ from 'underscore'
import {MyPolls} from '../containers/PollList.js'
import * as React from "react";
import Base from './BaseTemplate.jsx'
import {Link} from 'react-router'

export class Mine extends React.Component {

    constructor() {
        super();
    }

    componentDidMount() {
        this.props.afterDidMount();
    }

    render() {
        if (this.props.is_empty) {
            return <Base>
                <div className="row">
                    {
                        (this.props.user_logged_in) ?
                            <div className="col-6 offset-3">
                                <h5>It seem's that you haven't published anything yet :( </h5>
                            </div>
                            :
                            <div className="col-2 offset-5">
                                You need to <Link to="/log_in">log in </Link>
                            </div>
                    }
                </div>
            </Base>
        }
        return (
            <Base>
                <MyPolls />
            </Base>)
    }
}

Mine.propTypes = {
    afterDidMount: React.PropTypes.func.isRequired
};

export default connect(
    (state, own_props) => ({user_logged_in: state.user_logged_in, is_empty: _.isEmpty(state.mine)}),
    (dispatch) => ({afterDidMount: () => dispatch(fetch_created_polls())})
)(Mine);