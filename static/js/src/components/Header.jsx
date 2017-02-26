/**
 * Created by anis on 09/02/17.
 */
import * as React from 'react'
import {Link} from 'react-router'

const Header = ({logged_in}) => {
    const offset = (logged_in) ? "offset-3" : "offset-4";
    return <div className="row">
        <div className="col">
            <div className="row">
                <div className={offset + " col-8"}>
                    <div className="row">
                        <div className="col-2">
                            <Link to="/" style={{color: "black"}}>all</Link>
                        </div>
                        <div className="col-2">
                            <Link to="/mine" style={{color: "black"}}>mine</Link>
                        </div>
                        <div className="col-2">
                            <Link to="/create" style={{color: "black"}}>create</Link>
                        </div>
                        {
                            logged_in &&
                            <div className="col-2">
                                <a href="/logout" style={{color: "black"}}>log out</a>
                            </div>

                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
};

export default Header;