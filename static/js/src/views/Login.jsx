/**
 * Created by anis on 25/02/17.
 */

import {connect} from 'react-redux'
import _ from 'underscore'
import * as React from "react";
import Base from './BaseTemplate.jsx'
import {Link} from 'react-router'
export class Login extends React.Component {

    render() {
        return <Base>
            <div className="row">
                {
                    (this.props.user_logged_in) ?
                        <div className="col-6 offset-3">
                            log out
                        </div>
                        :
                        <div className="col-5 offset-4">
                            <div className="row">
                                <div className="col">
                                    <a href="/authorize/facebook" className="loginBtn loginBtn--facebook" style={{width : "70%", display : "block"}}>
                                        Login with Facebook
                                    </a>
                                </div>
                            </div>
                            {/*<div className="row">*/}
                                {/*<div className="col">*/}
                                    {/*<button className="loginBtn loginBtn--google" style={{width : "70%"}}>*/}
                                        {/*Login with Google*/}
                                    {/*</button>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        </div>
                }
            </div>
        </Base>

    }
}

Login.propTypes = {
    user_logged_in: React.PropTypes.bool.isRequired
};

export default connect(
    (state, own_props) => ({user_logged_in: state.user_logged_in}),
    null
)(Login);