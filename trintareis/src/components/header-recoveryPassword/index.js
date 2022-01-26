
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
                        <button className="btn__register__" type="submit">Cadastre-se agora</button>
                    </Link>
                    <Link to="/login">
                        <button className="btn__login__" type="submit">Entrar</button>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Header;