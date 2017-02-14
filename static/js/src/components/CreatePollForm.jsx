/**
 * Created by anis on 08/02/17.
 */
import * as React from "react";
import Base from '../views/BaseTemplate.jsx'
import ToggleButton from 'react-toggle-button'
import { Field, reduxForm } from 'redux-form'

const CreatePollForm = ({question, answers, save, remove_answer, publish}) => {
    const answers_components = answers.map(
        (answer, index) => (
            <div key={index} className="row form-group">
                <div className="col-10">
                    <input
                        value={answer.text}
                        onChange={
                            (e) => {
                                save({answer: {text: e.target.value, index: index}})
                            }
                        }
                        className="form-control"
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
                        <div className="col form-group">
                            <legend>Question :</legend>
                            <input
                                id='question_text_input'
                                value={question}
                                onChange={ (e) => save({question: {text: e.target.value}}) }
                                className="form-control"
                                type="text"
                                aria-label={"question"}/>
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
                                    <div className="row">
                                        <div className="col">
                                            <button
                                                onClick={ () => {save({answer: {"new": true}})} }
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
        </Base>
    )
};

CreatePollForm.propTypes = {
    question: React.PropTypes.string.isRequired,
    answers: React.PropTypes.arrayOf(
        React.PropTypes.shape(
            {text: React.PropTypes.string.isRequired, correct: React.PropTypes.bool.isRequired})
    ).isRequired,
    save: React.PropTypes.func.isRequired,
    publish: React.PropTypes.func.isRequired,
    remove_answer : React.PropTypes.func.isRequired
};

export default CreatePollForm;