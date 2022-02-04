*** Settings ***
Resource        ../resources/PO/HomeScreen.robot
Resource        ../resources/base.robot
Test Setup      Abrir navegador
Test Teardown   Fechar navegador

*** Test Case ***
Cenário 01: Abrir home screen
    Dado que estou na página home
    Então a página deve apresentar o botão Entrar
    E a página deve apresentar os links de acordo do usuario
    E a página deve apresentar campos de email e senha para cadastro
    E a página deve apresentar botão Aceitar e Cadastrar

Cenário 02: Acessar tela de login a partir da home screen
    Dado que estou na página home
    Quando clico no botão de login 
    Então a página de login é carregada