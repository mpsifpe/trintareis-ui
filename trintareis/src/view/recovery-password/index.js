import React, { useState } from 'react';
import './recoveryPassword.css';

import firebase from '../../config/firebase';
import 'firebase/auth';
import { Link } from "react-router-dom";


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
            <div>
            <form className="text-center form-login mx-auto mt-5 form__">
                <h3 className="mb-3 font-weight-bold">Esqueceu a senha?</h3>
                <p>Redefinir senha!</p>
                <input onChange={(e => setEmail(e.target.value))} type="email" className="form-control my-2" placeholder="Email" />
                <div className="msg my-4 text-center">
                    <span>{msg}</span>
                </div>
                <button onClick={recoveryPassword} type="button" className="w-100 btn btn-lg btn-block btn-enviar">Recuperar Senha</button>
                <Link to="/">
                    <button type="button" className="btn-backhome">Voltar</button>
                </Link>                
            </form>
            </div>
            
        </div>

    )
}

export default RecoveryPassword;