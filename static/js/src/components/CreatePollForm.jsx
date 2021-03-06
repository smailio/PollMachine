/**
 * Created by anis on 08/02/17.
 */
import * as React from "react";
import Base from '../views/BaseTemplate.jsx'
import ToggleButton from 'react-toggle-button'
import _ from 'underscore'
import {Link} from 'react-router'


const CreatePollForm = ({
    question, answers,
    allow_anonymous_vote, visibility, voters_visibility,
    save, remove_answer,
    publish, errors
}) => {
    const question_form_control_class = (!_.isEmpty(errors) && errors.question) ? 'form-control form-control-danger' : 'form-control';
    const answers_form_control_class = (!_.isEmpty(errors) && errors.answers) ? 'form-control form-control-danger' : 'form-control';
    const question_form_group_class = (!_.isEmpty(errors) && errors.question) ? 'form-group has-danger' : 'form-group';
    const answers_form_group_class = (!_.isEmpty(errors) && errors.answers) ? 'form-group has-danger' : 'form-group';
    const answers_components = answers.map(
        (answer, index) => (
            <div key={index} className={"row " + answers_form_group_class}>
                <div className="col-10">
                    <input
                        name="answer[]"
                        value={answer.text}
                        onChange={
                            (e) => {
                                save({answer: {text: e.target.value, index: index}})
                            }
                        }
                        className={"" + answers_form_control_class}
                        type="text"
                        aria-label={"answer-" + index}/>
                </div>
                <div className="col-2 align-self-center" style={{paddingLeft: 0, paddingRight: 0}}>
                    <div className="row">
                        <div className="col-11">
                            <div className="row">
                                <div className="col-9">
                                    <ToggleButton
                                        inactiveLabel={<span>✖</span>}
                                        activeLabel={<span>✔</span>}
                                        value={answer.correct}
                                        onToggle={ (value) => save({
                                            answer: {
                                                index: index,
                                                correct: !answer.correct
                                            }
                                        }) }/>
                                </div>
                                <div className="col-3">
                                    <button
                                        id="remove_last_answer_button"
                                        onClick={ () => remove_answer(index) }
                                        style={{fontSize: "1.2em"}}
                                        className="btn-sm close"
                                        type="button"
                                        aria-label={"Close answer-" + index}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        ));
    return (
        <Base>
            <div className="row" style={{marginTop: 10}}>
                <div className="col-md-7 offset-md-3">
                    <div className="row">
                        <div className={"col " + question_form_group_class}>
                            <legend>Question :</legend>
                            <input
                                id='question_text_input'
                                value={question}
                                onChange={ (e) => save({question: {text: e.target.value}}) }
                                className={"" + question_form_control_class}
                                type="text"
                                aria-label={"question"}/>
                            {
                                errors.question &&
                                <div className="form-control-feedback" role="alert">
                                    {errors.question}
                                </div>

                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="row">
                                <div className="col">
                                    <legend>Answers :</legend>
                                </div>
                            </div>
                            <div id="answers_input" className="row">
                                <div className="col">
                                    {answers_components}
                                    {
                                        errors.answers &&
                                        <div className={"row " + answers_form_group_class}>
                                            <div className="col">
                                                <div className="form-control-feedback">
                                                    {errors.answers}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <div className="row">
                                        <div className="col">
                                            <button
                                                onClick={ () => {
                                                    save({answer: {"new": true}})
                                                } }
                                                className="btn-sm btn-link">
                                                add answer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">Who can vote ?</div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">
                                    <input
                                        onChange={() => save({allow_anonymous_vote: !allow_anonymous_vote})}
                                        value="everyone"
                                        checked={allow_anonymous_vote == true}
                                        type="radio"
                                        className="form-check-input"/> everyone
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <label className="form-check-label">
                                    <input
                                        onChange={() => save({allow_anonymous_vote: !allow_anonymous_vote})}
                                        value="authenticated users"
                                        checked={allow_anonymous_vote == false}
                                        type="radio"
                                        className="form-check-input"/> authenticated users
                                </label>
                            </div>
                        </div>
                    </div>
                    { allow_anonymous_vote == false &&
                    <div>
                        <div className="row">
                            <div className="col">Who can see voters ?</div>
                        </div>
                        < div className="row">
                            <div className="col">
                                <div className="form-check form-check-inline">
                                    <label className="form-check-label">
                                        <input
                                            onChange={(e) => save({voters_visibility: e.target.value})}
                                            value="voters"
                                            checked={voters_visibility == "voters"}
                                            type="radio"
                                            className="form-check-input"/> voters
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <label className="form-check-label">
                                        <input
                                            onChange={(e) => save({voters_visibility: e.target.value})}
                                            value="me"
                                            checked={voters_visibility == "me"}
                                            type="radio"
                                            className="form-check-input"/> me
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <label className="form-check-label">
                                        <input
                                            onChange={(e) => save({voters_visibility: e.target.value})}
                                            value="nobody"
                                            checked={voters_visibility == "nobody"}
                                            type="radio"
                                            className="form-check-input"/> nobody
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                    <div className="row">
                        <div className="col">
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input
                                        id="visibility"
                                        onChange={() => save({visibility: ""})}
                                        checked={visibility == "shareable_by_link"}
                                        className="form-check-input"
                                        type="checkbox"/>
                                    <span>Shareable by link only</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    {
                        errors.log_in_required &&
                        <div className="row">
                            <div className="col">
                                <div className="alert alert-danger">
                                    You need to <Link to="/log_in" className="alert-link">log in</Link> in order to create a
                                    poll with such a configuration !
                                </div>
                            </div>
                        </div>
                    }
                    <div className="row">
                        <div className="offset-5 col-2">
                            <button
                                onClick={publish}
                                className="btn btn-outline-success">
                                publish
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Base >
    )
};

CreatePollForm.propTypes = {
    question: React.PropTypes.string.isRequired,
    answers: React.PropTypes.arrayOf(
        React.PropTypes.shape(
            {text: React.PropTypes.string.isRequired, correct: React.PropTypes.bool.isRequired})
    ).isRequired,
    allow_anonymous_vote: React.PropTypes.bool.isRequired,
    visibility: React.PropTypes.string.isRequired,
    save: React.PropTypes.func.isRequired,
    publish: React.PropTypes.func.isRequired,
    remove_answer: React.PropTypes.func.isRequired
};

export default CreatePollForm;