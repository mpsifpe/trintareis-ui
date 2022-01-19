import React, { useState } from "react";
import firebase from '../../config/firebase';
import 'firebase/auth';
import './homeScreen.css';
import { Link, Redirect } from 'react-router-dom';


function HomeScreen() {
    const [email, setEmail] = useState();
    const [senha, setSenha] = useState();
    const [carregando, setCarregando] = useState();

    function cadastrar() {
        if (!email || !senha) {
            alert('Você precisa informa o email e senha para realizar o cadastro!');
            return;
        }

        setCarregando(1);
        firebase.auth().createUserWithEmailAndPassword(email, senha).then(resultado => {
            setCarregando(0);
            alert('Sucesso');
        }).catch(erro => {
            alert(erro);
            setCarregando(0);
        })
    }
    return (
        <div className="div__main">
            <div className="div__header">
                <div>
                    <a href="#">Trinta Reis</a>
                </div>
                <div>
                    <form>
                        <Link to="/login">
                            <button className="btn__login" type="submit">Entrar</button>
                        </Link>
                    </form>
                </div>
            </div>
            <hr />
            <div className="div__primary_content">
                <div className="form__cadastro">
                    <form className="form-login row">
                        <h1 class="title">Cadastre-se</h1>
                        <p className="subtitle">Conheça pessoas, instituições e desfrute de uma rede colaborativa para seu descobrimento profissional!</p>
                        <fieldset className="textfield mb-24 mt32">
                            <label>E-mail</label>
                            <input onChange={(e) => setEmail(e.target.value)} type="email" class="form-control my-2" placeholder="Digite seu e-mail" />
                        </fieldset>
                        <fieldset className="textfield mb-12">
                            <label>Senha</label>
                            <input onChange={(e) => setSenha(e.target.value)} type="password" class="form-control my-2" placeholder="Digite sua Senha" />
                        </fieldset>
                        <span className="span__agreement">
                            Ao clicar em Aceite e cadastre-se, você aceita o
                            <a href="">Contrato do Usuário</a>
                            , a
                            <a href="">Política de Privacidade</a>
                            e a
                            <a href="">Política de Cookies</a>
                            do Trinta Reis.
                        </span>
                        {
                            carregando ? <button className="form-control btn btn-lg btn-block mt-1 mb-5 btn-cadastro" type="button" disabled>
                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            </button> :
                                <button onClick={cadastrar} type="button" className="form-control btn btn-lg btn-block mt-3 mb-5 btn-cadastro">Aceite e cadastre-se</button>
                        }
                    </form>
                </div>
                <div className="div__img">
                    <img src="https://firebasestorage.googleapis.com/v0/b/trintareis-23e4c.appspot.com/o/trintareis_img%2Fredes-comunidades-carreira.jpg?alt=media&token=bfd53475-b5fd-438c-bc08-e1c939d5ae46" />
                </div>
            </div>
        </div>
    )
}

export default HomeScreen;