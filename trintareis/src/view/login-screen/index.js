import './login.css';
import 'firebase/auth';

import React, { useState, useContext, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import firebase from '../../config/firebase';
import api from '../../config/api';
import loading from '../../resources/loading.gif';
import Header from '../../components/header-login/index';
import NotyfContext from '../../components/notyf-toast/NotyfContext';

function Login() {
    const [email, setEmail] = useState();
    const [senha, setSenha] = useState();
    const [enterBtn, setEnterBtn] = useState("Entrar");
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [firstLogin, setFirstLogin] = useState(undefined);
    const [loginRedirect, setLoginRedirect] = useState(null);

    const dispatch = useDispatch();
    const notyf = useContext(NotyfContext);

    useEffect(() => {
        if(loginSuccess && (firstLogin !== undefined)){        
            if(firstLogin){
                notyf.success('Bem-vindo!')
                setLoginRedirect(<Redirect to={{ pathname: '/editProfile', state: { firstLogin: true }}}/>)
            } else {
                notyf.success('Bem-vindo de volta!')
                setLoginRedirect(<Redirect to={{ pathname: '/home', state: { firstLogin: false }}}/>)
            }
        }

      },[firstLogin]);

    function singIn() {
        setEnterBtn(<img src={loading} style={{height: '25px', alignSelf: 'center'}}/>);

        firebase.auth().signInWithEmailAndPassword(email, senha)
        .then(result => {
            dispatch({ type: 'LOG_IN', emailUser: result.user.email });
            setLoginSuccess(true)
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
                case 'auth/argument-error':
                    notyf.error('Favor informar email e senha');
                    break;
                default:
                    notyf.error(error.message);
            }
        })
        .finally(()=>{
            let aux = []

            api.get('/profile/' + email)
            .then((response) => {
                (response.status === 200) ? aux.push(true) : aux.push(false)           })
            .catch((error) => {
                console.log(error)
                aux.push(false)           })
            .finally(() => {
                console.log("hasProfile return " + aux[0])
                setFirstLogin(!aux[0])           })
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
                        <fieldset className="textfield">
                            <span className="textfield">E-mail</span>
                            <input id="login2_email_npt" onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" placeholder="Digite seu e-mail"/>
                        </fieldset>
                        <fieldset className="textfield">
                            <span className="textfield">Senha</span>
                            <input id="login2_passw_npt" onChange={(e) => setSenha(e.target.value)} type="password" className="form-control" placeholder="Digite sua Senha" />
                        </fieldset>
                        <div className="link__recovery">
                            <Link to="/recoveryPassword" className=""><span>Esqueci minha senha</span></Link>
                        </div>
                        <button id="login2_enter_btn" onClick={singIn} className="w-100 btn btn-lg fw-bold bor" type="button">{enterBtn}</button>
                        <span className="invite">Não tem conta?</span>
                        <Link to="/register">
                            <button id="login2_reg_btn" className="w-100 btn btn-rg fw-bold bor" type="button">Cadastre-se</button>
                        </Link>
                        {loginRedirect}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;