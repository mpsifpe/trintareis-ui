import './login.css';
import 'firebase/auth';

import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import firebase from '../../config/firebase';
import api from '../../config/api';
import loading from '../../resources/loading.gif';
import Header from '../../components/header-login/index';
import NotyfContext from '../../components/notyf-toast/NotyfContext';
import { isEmpty, enterHandler, focusChangeOnEnter } from '../../helpers/helper';

function Login() {
    const [email, setEmail] = useState();
    const [senha, setSenha] = useState();
    const [enterBtn, setEnterBtn] = useState("Entrar");
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [firstLogin, setFirstLogin] = useState(undefined);
    const [loginRedirect, setLoginRedirect] = useState(<></>);
    const [profilePhoto, setProfilePhoto] = useState(undefined);
    const [coverPhoto, setCoverPhoto] = useState(undefined);
    const [userData, setUserData] = useState({});

    const dispatch = useDispatch();
    const notyf = useContext(NotyfContext);
    const passwordRef = useRef(null);

    useEffect(() => {
        if(loginSuccess && (firstLogin != undefined)){ 

            if(firstLogin){
                notyf.success('Bem-vindo!')
                setLoginRedirect(<Redirect to={{ pathname: '/editProfile', state: { firstLogin: true, profilePhoto: profilePhoto, coverPhoto: coverPhoto, userData: userData, origin:"login-screen" } }}/>)
            } else {
                notyf.success('Bem-vindo de volta!')
                setLoginRedirect(<Redirect to={{ pathname: '/home', state: { firstLogin: false, profilePhoto: profilePhoto, coverPhoto: coverPhoto, userData: userData, origin:"login-screen" } }}/>)
            }
        }
    },[firstLogin]);

    function singIn() {
        if(isEmpty(email) || isEmpty(senha)){
            notyf.error("Preencher email e senha");
        }
        else{
            setEnterBtn(<img src={loading} style={{height: '25px', alignSelf: 'center', opacity: '0.75'}}/>);

            firebase.auth().signInWithEmailAndPassword(email, senha)
            .then(result => {
                dispatch({ type: 'LOG_IN', emailUser: result.user.email });
                setLoginSuccess(true);
            })
            .catch((error) => {
                setEnterBtn("Entrar");
                switch(error.code) {
                    case 'auth/wrong-password':
                        notyf.error('Email e senha não conferem');
                        break;
                    case 'auth/invalid-email':
                        notyf.error('Email inserido inválido, verifiqe');
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
                setLoginRedirect(<Redirect to={{ pathname: '/login'}}/>)
            })
            .finally(()=>{
                let loginExists = []

                api.get('/profile/' + email)
                .then((response) => {
                    if(response.status === 200){
                        setUserData({ 
                            id: response.data.id,
                            userName: response.data.userName,
                            profileInformation: response.data.profileInformation,
                            details: response.data.details,
                            region: response.data.region,
                            city: response.data.city })
                            
                        if(!isEmpty(response.data.profilePhoto)) {  setProfilePhoto(response.data.profilePhoto)
                        } else {  setProfilePhoto("") };
                        
                        if(!isEmpty(response.data.coverPhoto)) {  setCoverPhoto(response.data.coverPhoto)
                        } else {  setCoverPhoto("") };
                        
                        loginExists.push(true);
                    }
                })
                .catch((error) => {
                    console.log(error)

                    switch(error.code) {
                        case 'ERR_BAD_RESPONSE':
                            dispatch({ type: 'LOG_OUT' });
                            notyf.error("Desculpe, ocorreu um erro no servidor");
                            setLoginRedirect(<Redirect to='/login'/>);
                            break;
                        case 'ERR_NETWORK':
                            dispatch({ type: 'LOG_OUT' });
                            notyf.error("Desculpe, ocorreu um erro no servidor");
                            setLoginRedirect(<Redirect to='/login'/>);
                            break;
                        case 'ERR_BAD_REQUEST':
                            console.log("primeiro login");
                            loginExists.push(false);
                            break;
                        default:
                            loginExists.push(false)
                        
                            setProfilePhoto("");
                            setCoverPhoto("");
                            setUserData({
                                            id: "", 
                                            userName: "",
                                            profileInformation: "",
                                            details: "",
                                            region: "",
                                            city: ""
                                        })
                            
                    }
                })
                .finally(() => {
                    setFirstLogin(!loginExists[0])
                })
            })
        }
    }

    return (
        <div className="div__main">
            <Header/>
            <hr />
            <div className="div-container container-fluid d-flex justify-content-between align-items-center w-100">
                <div className="form__signin mx-auto">
                    <form className="signin_container__form">
                        <h1 className="title">Bem-vindo de volta!</h1>
                        <p className="subtitle">Informe seu email e senha de cadastro para entrar</p>
                        <fieldset className="textfield">
                            <span className="textfield" style={{float:"left"}}>E-mail</span>
                            <input id="login2_email_npt" onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => focusChangeOnEnter(e, passwordRef)} type="email" className="form-control" placeholder="e-mail" autoFocus/>
                        </fieldset>
                        <fieldset className="textfield">
                            <span className="textfield" style={{float:"left"}}>Senha</span>
                            <input id="login2_passw_npt" onChange={(e) => setSenha(e.target.value)} onKeyDown={(e) => enterHandler(e, singIn)} ref={passwordRef} type="password" className="form-control" placeholder="senha" />
                        </fieldset>
                        <div className="link__recovery">
                            <Link to="/recoveryPassword" className=""><span>Esqueci minha senha</span></Link>
                        </div>
                        <div className='div_buttons_login'>
                            <button id="login2_enter_btn" onClick={singIn} className="btn btn-lg" type="button">{enterBtn}</button>
                            <span className="invite"/>
                            <Link to="/register">
                                <button id="login2_reg_btn" className="btn btn-rg" type="button">Cadastre-se</button>
                            </Link>
                        </div>
                        {loginRedirect}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;
