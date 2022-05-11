import React, { useState } from 'react';
import './login.css';
import firebase from '../../config/firebase';
import 'firebase/auth';
import { Link, Redirect } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

function Login() {
    const [email, setEmail] = useState();
    const [senha, setSenha] = useState();

    const dispatch = useDispatch();

    function singIn() {
        firebase.auth().signInWithEmailAndPassword(email, senha).then(resultado => {
            //alert('Usuário conectado!')
            dispatch({ type: 'LOG_IN', emailUser: email });
        }).catch(erro => {
            alert(erro)
        })
    }

    return (
        <div className="div-main">
            <nav className="navbar_login">
                <div className="text-logo container-fluid">
                    <a href="#">&#9818;30Reis</a>
                </div>
            </nav>
            <div className="div-container container-fluid d-flex justify-content-between align-items-center w-100">
                <div className="form-signin mx-auto">
                    {useSelector(state => state.loggedUSer) > 0 ? <Redirect to='/home' /> : null}

                    <form className="signin-container__form">
                        <h1 className="title">Já têm uma conta?</h1>
                        <p className="subtitle">Faça seu login e interaja com milhares de pessoas!</p>
                        <fieldset className="textfield mb-24 mt32">
                            <label>E-mail</label>
                            <input onChange={(e) => setEmail(e.target.value)} type="email" className="form-control my-2" placeholder="Digite seu e-mail" />
                        </fieldset>
                        <fieldset className="textfield mb-12">
                            <label>Senha</label>
                            <input onChange={(e) => setSenha(e.target.value)} type="password" className="form-control my-2" placeholder="Digite sua Senha" />
                        </fieldset>
                        <button onClick={singIn} className="w-100 btn btn-lg fw-bold" type="button">Entrar</button>
                        <div className="col-12 text-end mb-8">
                            <Link to="/recoveryPassword" className="color-primary font-7 mb-24">Esqueci minha senha</Link>
                        </div>
                    </form>
                </div>
                <div className="div-create-account mx-auto">
                    <h2>Criar uma conta</h2>
                    <h2>é rápido, fácil</h2>
                    <h2>e gratuito!!</h2>
                    <h2>Faça agora mesmo &#128521;</h2>
                    <Link to='novousuario'>
                        <button to='novousuario' className="w-100 btn btn-lg fw-bold" type="submit">Criar minha conta</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login;