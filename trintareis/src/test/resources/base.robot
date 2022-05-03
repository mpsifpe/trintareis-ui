*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${BROWSER}      chrome
${URL}          http://localhost:3000/        #https://dev-trintareis.netlify.app/

*** Keywords ***
#### Setup e Teardown
Abrir navegador
    Open Browser    ${URL}   ${BROWSER}    options=add_experimental_option('excludeSwitches', ['enable-logging'])

Fechar navegador
    Close Browser