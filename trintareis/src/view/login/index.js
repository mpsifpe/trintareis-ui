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
                            <h1 class="title">Já têm uma conta?</h1>
                            <p className="subtitle">Faça seu login e interaja com milhares de pessoas!</p>
                            <fieldset className="textfield mb-24 mt32">
                                <label>E-mail</label>
                                <input type="email" class="form-control my-2" placeholder="Digite seu e-mail" />
                            </fieldset>
                            <fieldset className="textfield mb-12">
                                <label>Senha</label>
                                <input type="password" class="form-control my-2" placeholder="Digite sua Senha"/>
                            </fieldset>
                            <button className="w-100 btn btn-lg fw-bold" type="submit">Entrar</button>
                            <div class="col-12 text-end mb-8">
                                <a href="#" class="color-primary font-7 mb-24">Esqueci minha senha</a>
                            </div>

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
                        <h2>Criar uma conta</h2>
                        <h2>é rápido, fácil</h2>
                        <h2>e gratuito!!</h2>
                        <h2>Faça agora mesmo &#128521;</h2>
                        <button className="w-100 btn btn-lg fw-bold" type="submit">Criar minha conta</button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Login;