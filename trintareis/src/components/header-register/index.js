
import React from "react";
import { Link } from 'react-router-dom';
import './header.css';

function Header() {
    return (
        <>
            <div className="div__header">
                <div className="div__title">
                    <a href="#">Trinta Reis</a>
                </div>
                <div className="div__btn">
                        <Link to="/login">
                            <button id="header_go_login_btn" type="submit">Entrar</button>
                        </Link>
                </div>
            </div>
        </>
    )
}

export default Header;

/* automation ids list

    header_go_login_btn
*/