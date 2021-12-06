import React, { useState } from "react";
import firebase from '../../config/firebase';
import 'firebase/auth';
import './new-user.css';

function NewUser() {

    const [email, setEmail] = useState();
    const [senha, setSenha] = useState();
    const [carregando, setCarregando] = useState();

    function cadastrar() {
        if(!email || !senha){
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
        <div className="form-cadastro">
            <for className="form-login mx-auto mt-5">
                <h1 class="title">Cadastre-se</h1>
                <p className="subtitle">É rápido e fácil!</p>
                <fieldset className="textfield mb-24 mt32">
                    <label>E-mail</label>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" class="form-control my-2" placeholder="Digite seu e-mail" />
                </fieldset>
                <fieldset className="textfield mb-12">
                    <label>Senha</label>
                    <input onChange={(e) => setSenha(e.target.value)} type="password" class="form-control my-2" placeholder="Digite sua Senha" />
                </fieldset>
                {
                    carregando ? <button className="form-control btn btn-lg btn-block mt-3 mb-5 btn-cadastro" type="button" disabled>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </button> :
                    <button onClick={cadastrar} type="button" className="form-control btn btn-lg btn-block mt-3 mb-5 btn-cadastro">Cadastrar</button>
                }

            </for>
        </div>
    )
}

export default NewUser;