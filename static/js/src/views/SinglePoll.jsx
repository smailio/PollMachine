/**
 * Created by anis on 08/01/17.
 */
import React from 'react';
import Loading  from 'react-loading';
import Poll from '../components/Poll.jsx'
import {connect} from 'react-redux'
import {fetch_poll, send_vote} from '../actions/index.js'
import _ from 'underscore'
import Base from './BaseTemplate.jsx'

class SinglePoll extends React.Component {
    componentDidMount() {
        let poll_id = this.props.params.poll_id;
        this.props.load_poll(poll_id);
    }

    render() {
        if (!this.props.poll_loaded) {
            return <Loading type='balls' color='#e3e3e3'/>;
        }
        else {
            return (
                <Base>
                    <div className="row">
                        <div className="col-md-11 col-xl-6 offset-xl-3">
                            <Poll
                                poll={this.props.poll}
                                vote={this.props.vote}/>
                        </div>
                    </div>
                </Base>
            );
        }
    }
}

export default connect(
    (state, own_props) => ({
        poll : state.polls[own_props.params.poll_id],
        poll_loaded: _.has(state.polls, own_props.params.poll_id)}),
    (dispatch) => ({
        vote :
            (poll_id, answer_id) => {
                dispatch(send_vote(poll_id, answer_id));
                dispatch(fetch_poll(poll_id))},
        load_poll: (poll_id) => dispatch(fetch_poll(poll_id))})
)(SinglePoll);