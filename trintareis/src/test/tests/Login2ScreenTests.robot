*** Settings ***
Resource        ../resources/PO/Login2Screen.robot
Resource        ../resources/base.robot
Test Setup      Abrir navegador
Test Teardown   Fechar navegador

*** Test Case ***
Cenário 01: Fazer login com usuario valido
    Dado que estou na página home
    E acesso a página de login
    Quando insiro email e senha de um usuario valido
    Então é possivel fazer login