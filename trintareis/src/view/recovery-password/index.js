import React, { useState } from 'react';
import './recoveryPassword.css';

import firebase from '../../config/firebase';
import 'firebase/auth';
import { Link } from "react-router-dom";

import Header from '../../components/header-recoveryPassword/index';

function RecoveryPassword() {
    const [email, setEmail] = useState();
    const [msg, setMsg] = useState();

    function recoveryPassword() {
        firebase.auth().sendPasswordResetEmail(email).then(result => {
            setMsg('Enviamos um link no seu e-mail para redefinir senha');
        }).catch(error => {
            setMsg('Verique se o email é válido!')
        })
    }

    return (
        <div className="recovery__password">
            <Header/>
            <hr />
            <div className="div__form_main">
                <form className="div__form">
                    <h3 className="mb-3 font-weight-bold div__form_itens">Esqueceu a senha?</h3>
                    <p className="div__form_itens">Redefinir senha!</p>
                    <input onChange={(e => setEmail(e.target.value))} type="email" className="form-control my-2" placeholder="Email" />
                    <span>{msg}</span>
                    <button onClick={recoveryPassword} type="button" className="btn btn-lg btn-block btn-enviar">Recuperar Senha</button>
                    <Link to="/login">
                        <button type="button" className="btn-backhome">Voltar</button>
                    </Link>
                </form>
            </div>

        </div>

    )
}


export default RecoveryPassword;