import './login.css';
import 'firebase/auth';
import React, { useState, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import firebase from '../../config/firebase';
import Header from '../../components/header-login/index';
import NotyfContext from '../../components/notyf-toast/NotyfContext';
import { hasProfile } from '../../helpers/profile-helper';

function Login() {
    const [email, setEmail] = useState();
    const [senha, setSenha] = useState();
    const [loginRedirect, setLoginRedirect] = useState(null);

    const dispatch = useDispatch();
    const notyf = useContext(NotyfContext);

    function singIn() {
        firebase.auth().signInWithEmailAndPassword(email, senha).then(result => {
            dispatch({ type: 'LOG_IN', emailUser: result.user.email });
            setEmail(result.user.email);
            notyf.success('Bem-vindo de volta!')
        })
        .catch((error) => {
            setLoginRedirect(<Redirect to='/login'/>);
            switch(error.code) {
                case 'auth/wrong-password':
                    notyf.error('Senha incorreta');
                    break;
                case 'auth/invalid-email':
                    notyf.error('E-mail inválido');
                    break;
                case 'auth/user-not-found':
                    notyf.error('Usuário não cadastrado');
                    break;
                default:
                    notyf.error(error.message);
              }
        })
        .finally(() => {
            hasProfile(email) ? 
                setLoginRedirect(<Redirect to='/editProfile'/>) : setLoginRedirect(<Redirect to='/home' />)
        })
    }

    return (
        <div className="div__main">
            <Header/>
            <hr />
            <div className="div-container container-fluid d-flex justify-content-between align-items-center w-100">
                <div className="form__signin mx-auto">
                    
                    
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
                        <span className="subtitle">Não tem conta?</span>
                        <Link to="/register">
                            <button id="login2_enter_btn" className="w-100 btn btn-rg fw-bold bor" type="button">Cadastre-se</button>
                        </Link>
                        {loginRedirect}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;