
import React from "react";
import { Link } from 'react-router-dom';
import './headerLogin.css';

function Header() {
    return (
        <>
            <div className="div__header">
                <div className="div__title">
                    <a href="#">Trinta Reis</a>
                </div>
                <div className="div__btn_login">
                    <Link to="/">
                        <button id="header_log_register_btn" type="submit">Cadastre-se agora</button>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Header;

/* automation ids list

    header_log_register_btn
*/