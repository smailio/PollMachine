/**
 * Created by anis on 09/02/17.
 */
import * as React from 'react'
import {Link} from 'react-router'
import NotificationSystem from 'react-notification-system';


const Header = ({publish_notification}) => (
    <div className="row">
        <div className="col">
            <div className="row">
                <div className="offset-4 col-8">
                    <div className="row">
                        <div className="offset-1 col-2">
                            <Link to="/" style={{color: "black"}}>all</Link>
                        </div>
                        <div className="col-2">
                            <Link to="/mine" style={{color: "black"}}>mine</Link>
                        </div>
                        <div className="col-2">
                            <Link to="/create" style={{color: "black"}}>create</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Header;