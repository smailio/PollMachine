/**
 * Created by anis on 08/01/17.
 */
import * as React from "react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Poll from './Poll.jsx'
import _ from 'underscore'

export default class PollList extends React.Component {
    render() {
        let polls = this.props.polls;
        let limit = this.props.limit;
        let polls_components = _.keys(polls)
            .slice(0, limit)
            .map( (poll_id) => polls[poll_id]).map(
            (poll) => {
                return <Poll
                    key={poll.poll_id}
                    poll={poll}
                    vote={this.props.vote}/>;
            });
        return (
            <div className="row">
                <div className="col-md-11 col-xl-6 offset-xl-3">
                    <ReactCSSTransitionGroup
                        transitionName="polls"
                        transitionEnterTimeout={600}
                        transitionLeaveTimeout={200}>
                        {polls_components}
                    </ReactCSSTransitionGroup>
                </div>
            </div>);
    }
}

PollList.propTypes = {
    polls: React.PropTypes.object.isRequired,
    limit: React.PropTypes.number,
    vote: React.PropTypes.func.isRequired
};
