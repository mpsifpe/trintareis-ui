import './login.css';
import 'firebase/auth';
import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import firebase from '../../config/firebase';
import Header from '../../components/header-login/index';
import { hasProfile } from '../../helpers/profile-helper';

function Login() {
    const [email, setEmail] = useState();
    const [senha, setSenha] = useState();
    const [loginRedirect, setLoginRedirect] = useState(null);

    const dispatch = useDispatch();

    function singIn() {
        firebase.auth().signInWithEmailAndPassword(email, senha).then(result => {
            dispatch({ type: 'LOG_IN', emailUser: result.user.email });
            
            !hasProfile(result.user.email) ? 
                setLoginRedirect(<Redirect to='/editProfile' />) : setLoginRedirect(<Redirect to='/home' />)

        }).catch(erro => {
            alert(erro)
        })
    }

    return (
        <div className="div__main">
            <Header/>
            <hr />
            <div className="div-container container-fluid d-flex justify-content-between align-items-center w-100">
                <div className="form__signin mx-auto">
                    
                    {loginRedirect}
                    <form className="signin-container__form">
                        <h1 className="title">Bem-vindo de volta!</h1>
                        <p className="subtitle">Faça seu login e interaja com milhares de pessoas!</p>
                        <fieldset className="textfield mb-24 mt32">
                            <label>E-mail</label>
                            <input id="login2_email_npt" onChange={(e) => setEmail(e.target.value)} type="email" className="form-control my-2" placeholder="Digite seu e-mail"/>
                        </fieldset>
                        <fieldset className="textfield mb-12">
                            <label>Senha</label>
                            <input id="login2_passw_npt" onChange={(e) => setSenha(e.target.value)} type="password" className="form-control my-2" placeholder="Digite sua Senha" />
                        </fieldset>
                        <div className="link__recovery">
                            <Link to="/recoveryPassword" className=""><span>Esqueci minha senha</span></Link>
                        </div>
                        <button id="login2_enter_btn" onClick={singIn} className="w-100 btn btn-lg fw-bold bor" type="button">Entrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;