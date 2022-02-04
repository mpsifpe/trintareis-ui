*** Settings ***
Library         SeleniumLibrary
Resource        ../helpers.robot


*** Keywords ***
Dado que estou na página home
    Wait Until Element Is Visible       id=homescreen_accept_btn

E acesso a página de login
    Sleep And Click                     id=header_go_login_btn
    Wait Until Element Is Visible       id=login2_email_npt

Quando insiro email e senha de um usuario valido
    Input Text                          id=login2_email_npt     teste@30reis.com.br 
    Input Text                          id=login2_passw_npt     teste12345

Então é possivel fazer login
    Click Element                       id=login2_enter_btn
    Wait Until Element Is Visible       class=header
    Page Should Contain Element         class=feed
