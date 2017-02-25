/**
 * Created by anis on 08/01/17.
 */
import React from "react";

export default class PollAnswer extends React.Component {

    render() {
        let answer = this.props.answer;
        if (this.props.answered) {
            let classNames = " ";
            if (answer.correct) {
                classNames += " right-answer ";
            }
            else {
                classNames += " wrong-answer ";
            }
            let classNameSelectedAnswer = " answer ";
            if (answer.answer_id == this.props.selected_answer_id) {
                classNameSelectedAnswer += " selected-answer ";
            }
            let widthPercentage;
            if(this.props.total_voters == 0){
                widthPercentage = 0;
            }
            else {
                widthPercentage = (answer.voters / this.props.total_voters) * 100;
                widthPercentage = Math.round(widthPercentage).toFixed(0);
            }
            return (
                <div className="row" style={{marginTop : 5}}>
                    <div className="col-md-1">
                        <div className="voters-percentage">
                            {widthPercentage + "%"}
                        </div>
                    </div>
                    <div className="col-md-8 ">
                        <div className={classNameSelectedAnswer}>
                            <div
                                className={classNames}
                                style={{width : widthPercentage +"%"}}>
                                <span className="answer-content" style={{marginLeft : 4}}>{answer.text}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="voters-counter">{answer.voters} voters</div>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="row">
                    <div onClick={this.props.respond} className="answer neutral-answer col-md-8">
                    <span
                        style={{marginLeft : 4}}>
                        {answer.text}
                    </span>
                    </div>
                </div> );
        }
    }
}

PollAnswer.propTypes = {
    answer: React.PropTypes.object.isRequired,
    selected_answer_id: React.PropTypes.number,
    answered: React.PropTypes.bool.isRequired,
    total_voters: React.PropTypes.number.isRequired,
    respond: React.PropTypes.func.isRequired
};