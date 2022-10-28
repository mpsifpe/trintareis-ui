import React, { useState } from "react";
import firebase from '../../config/firebase';
import 'firebase/auth';
import './registerScreen.css';

import Header from '../../components/header-register/index';


function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState();

    function cadastrar() {
        if (!email || !senha) {
            alert('Você precisa informa o email e senha para realizar o cadastro!');
            return;
        }

        var saveSucess = false;
        setCarregando(1);
        firebase.auth().createUserWithEmailAndPassword(email, senha).then(resultado => {
            setCarregando(0);
            alert('Usuário cadastrado com sucesso!');
            setEmail('');
            setSenha('');
        }).catch(erro => {
            alert(erro);
            setCarregando(0);
        })
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
                            <input id="homescreen_email_npt" onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="form-control my-2" placeholder="Digite seu e-mail" />
                        </fieldset>
                        <fieldset className="textfield mb-12">
                            <label>Senha</label>
                            <input id="homescreen_passw_npt" onChange={(e) => setSenha(e.target.value)} value={senha} type="password" className="form-control my-2" placeholder="Digite sua Senha" />
                        </fieldset>
                        <span className="span__agreement">
                            Ao clicar em Aceite e cadastre-se, você aceita o
                            <a id="homescreen_contract_link"href="">Contrato do Usuário</a>
                            , a
                            <a id="homescreen_privacy_link"href="">Política de Privacidade</a>
                            e a
                            <a id="homescreen__cookies_link" href="">Política de Cookies</a>
                            do Trinta Reis.
                        </span>
                        <div>
                        {
                            carregando ? <button className="form-control btn btn-lg btn-block mt-1 mb-5 btn-cadastro" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            </button> :
                                <button id="homescreen_accept_btn" onClick={cadastrar} type="button" className="form-control btn btn-lg btn-block mt-3 mb-5 btn-cadastro">Aceite e cadastre-se</button>
                        }
                        </div>
                    </form>
                </div>
                <div className="div__img">
                    <img src="https://firebasestorage.googleapis.com/v0/b/trintareis-23e4c.appspot.com/o/trintareis_img%2Fredes-comunidades-carreira.jpg?alt=media&token=bfd53475-b5fd-438c-bc08-e1c939d5ae46" />
                </div>
            </div>
        </div>
    )
}

export default RegisterScreen;