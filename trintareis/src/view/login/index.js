import React from "react";
import './login.css'

function Login() {
    return (
        <div className="div-main">
            <nav className="navbar">
                <div className="text-logo container-fluid">
                    <a href="#">&#9818;30Reis</a>
                </div>
            </nav>
            <main>
                <div className="div-container container-fluid d-flex justify-content-between align-items-center w-100">
                    <div className="form-signin mx-auto">
                        <form className="signin-container__form">
                            <h3 class="fw-bold">Acesse sua conta</h3>
                            <fieldset className="textfield mb-24 mt32">
                                <input type="email" class="form-control my-2" placeholder="Digite seu email*" />
                            </fieldset>
                            <fieldset className="textfield mb-12">
                                <input type="password" class="form-control my-2" placeholder="Digite sua Senha*"/>
                            </fieldset>
                            <div class="col-12 text-end mb-8">
                                <a href="#" class="color-primary font-7 mb-24">Esqueci minha senha</a>
                            </div>
                            <button className="w-100 btn btn-lg fw-bold" type="submit">Entrar</button>

                            {/* <div className="msg-login text-dark text-center my-5">
                                    <span><strong>WoW!</strong> Você está conectado! &#128526;</span>
                                    <br></br>
                                    <span><strong>Ops!</strong> Verifique a senha ou usuário! &#128546;</span>
                                </div>
                            <div class="auth-form__account text-center mt-24 mb-28">Não tem uma conta?
                                    <a class="auth-form__account--link false" href="/cadastrar/2f" id="create-account-button" tabindex="4">  Crie uma conta</a>
                                </div>
                            <button className="signinPrivacy mt-50" type="button">
                                Termo de uso | Política de Privacidade
                                </button> */}
                        </form>
                    </div>
                    <div className="div-create-account mx-auto">
                        <h1>Criar uma conta é rápido,</h1>
                        <h1>fácil e gratuito!</h1>
                        <button type="submit">Criar minha conta</button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Login;