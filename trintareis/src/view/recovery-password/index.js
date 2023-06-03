import React, { useState } from 'react';
import './recoveryPassword.css';

import firebase from '../../config/firebase';
import 'firebase/auth';
import { Link } from "react-router-dom";

import Header from '../../components/header-recoveryPassword/index';

function RecoveryPassword() {
    const [email, setEmail] = useState();
    // const [msg, setMsg] = useState();

    function recoveryPassword() {
        firebase.auth().sendPasswordResetEmail(email).then(result => {
            alert('Enviamos um link no seu e-mail para redefinir senha');
            setEmail('');
        }).catch(error => {
            alert('Verique se o email é válido!')
        })
    }

    return (
        <div className="recovery__password">
            <Header/>
            <hr />
            <div className="div__form_main">
                <form className="div__form">
                    <h3 className="mb-3 font-weight-bold div__form_itens">Esqueceu a senha?</h3>
                    <div className="textfield">
                        <span className="textfield">Informe o e-mail da conta</span>
                        <input onChange={(e => setEmail(e.target.value))} value={email} type="email" className="form-control" placeholder="E-mail" />
                    </div>
                    {/* <span>{msg}</span> */}
                    <div className='buttons'>
                        <button onClick={recoveryPassword} type="button" className="btn-enviar">Recuperar Senha</button>
                        <Link to="/login">
                            <button type="button" className="btn-backhome">Voltar</button>
                        </Link>                        
                    </div>
                </form>
            </div>

        </div>

    )
}


export default RecoveryPassword;