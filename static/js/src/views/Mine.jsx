/**
 * Created by anis on 24/02/17.
 */
import {connect} from 'react-redux'
import {fetch_created_polls} from '../actions/index.js'
import _ from 'underscore'
import {MyPolls, SearchResult} from '../containers/PollList.js'
import SearchForm from '../containers/SearchForm.js'
import * as React from "react";
import Base from './BaseTemplate.jsx'
import {Link} from 'react-router'
import {browserHistory} from 'react-router'

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
                            <div className="offset-4 col-8">
                                <div className="row">
                                    <div className="offset-2 col-2">
                                        <Link to="/log_in">log in </Link>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </Base>
        }
        return (
            <Base>
                <div className="row">
                    <div className="offset-3 col-6">
                        <SearchForm />
                    </div>
                </div>
                {(this.props.show_result) ? <SearchResult /> : <MyPolls />}
            </Base>)
    }
}

Mine.propTypes = {
    afterDidMount: React.PropTypes.func.isRequired
};

export default connect(
    (state, own_props) => ({
        user_logged_in: state.user_logged_in,
        is_empty: _.isEmpty(state.mine),
        show_result: state.search.text && !_.isEmpty(state.search.result)
    }),
    (dispatch) => ({afterDidMount: () => dispatch(fetch_created_polls())})
)(Mine);