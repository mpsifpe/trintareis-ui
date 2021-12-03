import React, { useState } from 'react';
import './login.css';
import firebase from '../../config/firebase';
import 'firebase/auth';

function Login() {
    const [email, setEmail] = useState();
    const [senha, setSenha] = useState();

    function singIn() {
        firebase.auth().signInWithEmailAndPassword(email, senha).then(resultado => {
            alert('Usuário logado!');
        }).catch(erro => {
            alert(erro);
        })
    }
    return (
        <div className="div-main">
            <nav className="navbar">
                <div className="text-logo container-fluid">
                    <a href="#">&#9818;30Reis</a>
                </div>
            </nav>
            <div className="div-container container-fluid d-flex justify-content-between align-items-center w-100">
                <div className="form-signin mx-auto">
                    <form className="signin-container__form">
                        <h1 class="title">Já têm uma conta?</h1>
                        <p className="subtitle">Faça seu login e interaja com milhares de pessoas!</p>
                        <fieldset className="textfield mb-24 mt32">
                                <label>E-mail</label>
                                <input onChange={(e) => setEmail(e.target.value)} type="email" class="form-control my-2" placeholder="Digite seu e-mail" />
                            </fieldset>
                            <fieldset className="textfield mb-12">
                                <label>Senha</label>
                                <input onChange={(e) => setSenha(e.target.value)} type="password" class="form-control my-2" placeholder="Digite sua Senha"/>
                            </fieldset>
                        <button onClick={singIn} className="w-100 btn btn-lg fw-bold" type="button">Entrar</button>
                        <div class="col-12 text-end mb-8">
                            <a href="#" class="color-primary font-7 mb-24">Esqueci minha senha</a>
                        </div>
                    </form>
                </div>
                <div className="div-create-account mx-auto">
                    <h2>Criar uma conta</h2>
                    <h2>é rápido, fácil</h2>
                    <h2>e gratuito!!</h2>
                    <h2>Faça agora mesmo &#128521;</h2>
                    <button className="w-100 btn btn-lg fw-bold" type="submit">Criar minha conta</button>
                </div>
            </div>
        </div>
    )
}

export default Login;