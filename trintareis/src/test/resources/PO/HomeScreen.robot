*** Settings ***
Library         SeleniumLibrary
Resource        ../helpers.robot

*** Keywords ***
Dado que estou na página home
    Wait Until Element Is Visible       id=homescreen_accept_btn

Então a página deve apresentar o botão Entrar
    Page Should Contain Button          id=header_go_login_btn

E a página deve apresentar os links de acordo do usuario
    Page Should Contain Element         id=homescreen_contract_link
    Page Should Contain Element         id=homescreen_privacy_link
    Page Should Contain Element         id=homescreen__cookies_link

E a página deve apresentar campos de email e senha para cadastro
    Page Should Contain Element         id=homescreen_email_npt
    Page Should Contain Element         id=homescreen_passw_npt

E a página deve apresentar botão Aceitar e Cadastrar
    Sleep                               2
    Page Should Contain Button          id=homescreen_accept_btn
    
Quando clico no botão de login
    Wait And Click                      id=header_go_login_btn

Então a página de login é carregada
    Wait Until Element Is Visible       id=login2_email_npt
    Sleep                               2

    