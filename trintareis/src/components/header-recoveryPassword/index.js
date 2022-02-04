
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
                <div>
                    <Link to="/">
                        <button id="header_rec_register_btn" className="btn__register__" type="submit">Cadastre-se agora</button>
                    </Link>
                    <Link to="/login">
                        <button id="header_rec_login_btn" className="btn__login__" type="submit">Entrar</button>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Header;

/* automation ids list

    header_rec_register_btn
    header_rec_login_btn
*/