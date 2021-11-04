import React from "react";
import './login.css'

function Login(){
    return(
        <div className="login-content d-flex align-items-center">
            <form className="form-signin mx-auto">
                <div className="text-center mb-4">
                    {/* <img className="mb-4" src="/docs/5.1/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57"/> */}
                    <h1 className="h1 mb-3 text-white font-weight-bold">30Reis</h1>
                </div>

                <input type="email" class="form-control my-2" placeholder="E-mail"/>
                <input type="password" class="form-control my-2" placeholder="Senha"/>        

                <button className="w-100 btn btn-lg btn-primary btn-login" type="submit">Entrar</button>
                
                {/* <div className="msg-login text-white text-center my-5">
                    <span><strong>WoW!</strong> Você está conectado! &#128526;</span>
                    <br></br>
                    <span><strong>Ops!</strong> Verifique a senha ou usuário! &#128546;</span>
                </div> */}
                <div className="opcoes-login mt-1 text-center">
                    <a href="#" className="mx-2">Recuperar senha</a>
                    <span className="text-white">&#9733;</span>
                    <a href="#" className="mx-2">Cadastrar</a>
                </div>

                <button className="signinPrivacy mt-50" type="button">
                    Termo de uso | Política de Privacidade
                </button>
            </form>
        </div>
    )
}

export default Login;