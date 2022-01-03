import React, { useState } from 'react';
import './recoveryPassword.css';

import firebase from '../../config/firebase';
import 'firebase/auth';


function RecoveryPassword() {
    const [email, setEmail] = useState();
    const [msg, setMsg] = useState();

    function recoveryPassword(){
        firebase.auth().sendPasswordResetEmail(email).then(result => {
            setMsg('Enviamos um link no seu e-mail para redefinir senha');
        }).catch(error => {
            setMsg('Verique se o email é válido!')
        })
    }

    return (
        <form className="text-center form-login mx-auto mt-5">
            <h3 className="mb-3 font-weight-bold">Recuperar Senha</h3>
            <input onChange={(e => setEmail(e.target.value))} type="email" className="form-control my-2" placeholder="Email" />
            <div className="msg my-4 text-center">
                <span>{msg}</span>
            </div>
            <button onClick={recoveryPassword} type="button" className="w-100 btn btn-lg btn-block btn-enviar">Recuperar Senha</button>
        </form>
    )
}

export default RecoveryPassword;