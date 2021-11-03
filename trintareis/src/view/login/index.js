import React from "react";
import './login.css'

function Login(){
    return(
        <div className="login-content d-flex align-items-center">
            <form className="form-signin mx-auto">
                <div className="text-center mb-4">
                    <img className="mb-4" src="/docs/5.1/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57"/>
                    <h1 className="h3 mb-3 fw-normal">Login</h1>
                </div>

                <div className="form-label-group">
                    <input type="email" class="form-control" placeholder="E-mail"/>
                </div>
                <div className="form-label-group">
                    <input type="password" class="form-control" placeholder="Senha"/>
                </div>        
                <div className="form-label-sign-in">
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Entrar</button>
                    {/* <p class="mt-5 mb-3 text-muted">&copy; 2017–2021</p> */}
                </div>
                <button className="signinPrivacy" type="button">
                    Termo de uso | Política de Privacidade
                </button>
            </form>
        </div>
    )
}

export default Login;