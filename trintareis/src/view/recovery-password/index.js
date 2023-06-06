import React, { useState } from 'react';
import './recoveryPassword.css';

import firebase from '../../config/firebase';
import 'firebase/auth';
import { Redirect } from "react-router-dom";

import Header from '../../components/header-login/index';

function RecoveryPassword() {
    const [email, setEmail] = useState();
    const [redirect, setRedirect] = useState(<></>);

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
                        <div className='buttons'>
                            <button onClick={recoveryPassword} type="button" className="btn-enviar">Recuperar Senha</button><br/>
                            <button onClick={()=>{setRedirect(<Redirect to={{pathname: '/login'}}/>)}} type="button" className="btn-backhome">Voltar</button>                    
                        </div>
                    </div>
                </form>
            </div>
        {redirect}
        </div>

    )
}


export default RecoveryPassword;