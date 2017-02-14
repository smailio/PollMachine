/**
 * Created by anis on 08/01/17.
 */
import * as React from "react"
import PollAnswer from './PollAnswer.jsx'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Router, Route, hashHistory, Link} from 'react-router'

export default class Poll extends React.Component {

    render() {
        let poll = this.props.poll;
        let question = poll.question;
        let answers = poll.answers;
        let pol_url = "/poll/" + poll.poll_id;
        let is_answered = poll.answered != undefined;
        let selected_answer_id = poll.selected_answer_id;
        let total_voters = this.props.poll.answers.reduce(
            (accumulator, answer) => {
                return accumulator + answer.voters;
            }, 0
        );
        let answers_components = answers.map(
            (answer) => {
                return <PollAnswer
                    key={answer.answer_id}
                    answer={answer}
                    answered={is_answered}
                    selected_answer_id={selected_answer_id}
                    respond={() => this.props.vote(poll.poll_id, answer.answer_id)}
                    total_voters={total_voters}/>;
            });
        if (is_answered) {  
            answers_components = (
                <ReactCSSTransitionGroup
                    transitionName="answers"
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionLeaveTimeout={500}
                    transitionEnterTimeout={100}>
                    {answers_components}
                </ReactCSSTransitionGroup>
            );
        }
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="card" style={{border : 0}}>
                        <div className="card-block">
                            <h4 className="card-title">
                                <Link
                                    style={{color : "black"}}
                                    to={pol_url}>
                                    {question}
                                </Link>
                            </h4>
                            {answers_components}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Poll.propTypes = {
    poll: React.PropTypes.object.isRequired,
    vote: React.PropTypes.func.isRequired
};
