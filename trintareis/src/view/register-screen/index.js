import React, { useState, useContext, useRef } from "react";
import { Redirect } from 'react-router-dom';
import firebase from '../../config/firebase';
import 'firebase/auth';
import './registerScreen.css';

import Header from '../../components/header-register/index';
import welcome from '../../resources/welcome.png';
import NotyfContext from "../../components/notyf-toast/NotyfContext";
import { enterHandler, focusChangeOnEnter } from "../../helpers/helper";


function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [redirect, setRedirect] = useState(<></>)

    const notyf = useContext(NotyfContext);
    const passwordRef = useRef(null);

    function cadastrar() {
        if (!email || !senha) {
            notyf.error('Favor informar email e senha');
        } 
        else {
            firebase.auth().createUserWithEmailAndPassword(email, senha).then(() => {
                alert('Usuário cadastrado com sucesso!');
                setRedirect(
                    <Redirect to={{ 
                        pathname: '/editProfile', 
                        state: { 
                            firstLogin: true, 
                            profilePhoto: "", 
                            coverPhoto: "", 
                            userData: {
                                id: "", 
                                userName: "",
                                profileInformation: "",
                                details: "",
                                region: "",
                                city: "" }}}}/>)

            })
            .catch(error => {
                console.log(error);

                switch(error.code) {
                    case 'auth/email-already-in-use':
                        notyf.error('Já existe uma conta associada a este email, deseja fazer login?');
                        break;
                    case 'auth/invalid-email':
                        notyf.error('O e-mail inserido é inválido');
                        break;
                    case 'auth/weak-password':
                        notyf.error('A senha informada é muito fraca');
                        break;
                    default:
                        notyf.error("Desculpe, ocorreu um erro ao fazer seu cadastro");
                        break;
                }
            })
        }
    }

    return (
        <div className="div__main">
            <Header/>
            <hr />
            <div className="div__primary_content">
                <div className="form__cadastro">
                    <form className="form-login row">
                        <h1 className="title">Cadastre-se</h1>
                        <p className="subtitle">Conheça pessoas, instituições e desfrute de uma rede colaborativa para seu descobrimento profissional!</p>
                        <fieldset className="textfield mb-24 mt32">
                            <label>E-mail</label>
                            <input id="homescreen_email_npt" onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => focusChangeOnEnter(e, passwordRef)} value={email} type="email" className="form-control my-2" placeholder="Digite seu e-mail" />
                        </fieldset>
                        <fieldset className="textfield mb-12">
                            <label>Senha</label>
                            <input id="homescreen_passw_npt" onKeyDown={(e) => enterHandler(e, cadastrar)} onChange={(e) => setSenha(e.target.value)} ref={passwordRef} value={senha} type="password" className="form-control my-2" placeholder="Digite sua Senha" />
                        </fieldset>
                        <span className="span__agreement">
                            Ao clicar em Aceite e cadastre-se, você aceita o
                            <a id="homescreen_contract_link">Contrato do Usuário</a>
                            , a
                            <a id="homescreen_privacy_link">Política de Privacidade</a>
                            e a
                            <a id="homescreen__cookies_link">Política de Cookies</a>
                            do Trinta Reis.
                        </span>
                        <div className="div__register_btn">
                            <button id="homescreen_accept_btn" onClick={cadastrar} type="button">Aceitar e cadastrar</button>
                        </div>
                    </form>
                </div>
                <div className="div__img">
                    <img src={welcome} />
                </div>
                {redirect}
            </div>
        </div>
    )
}

export default RegisterScreen;