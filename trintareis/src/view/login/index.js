import React from "react";
import './login.css'

function Login(){
    return(
        <div className="container-fluid d-flex justify-content-between align-items-center w-100">
            <form className="form-signin mx-auto">
                <div className="text-center mb-4">
                    <h1 className="h1 mb-3 text-info font-weight-bold">30Reis</h1>
                </div>

                <input type="email" class="form-control my-2" placeholder="E-mail*"/>
                <input type="password" class="form-control my-2" placeholder="Senha*"/>
                
                <div class="col-12 text-right mb-8">
                    <a href="/esqueci-minha-senha" class="color-primary font-7 text-right mb-24">Esqueci minha senha</a>
                </div>

                <button className="w-100 btn btn-lg btn-primary btn-login" type="submit">Entrar</button>
                
                {/* <div className="msg-login text-dark text-center my-5">
                    <span><strong>WoW!</strong> Você está conectado! &#128526;</span>
                    <br></br>
                    <span><strong>Ops!</strong> Verifique a senha ou usuário! &#128546;</span>
                </div> */}
                <div class="auth-form__account text-center mt-24 mb-28">Não tem uma conta?
                    <a class="auth-form__account--link false" href="/cadastrar/2f" id="create-account-button" tabindex="4">  Crie uma nova conta</a>
                </div>

                {/* <button className="signinPrivacy mt-50" type="button">
                    Termo de uso | Política de Privacidade
                </button> */}
            </form>
        </div>
    )
}

export default Login;