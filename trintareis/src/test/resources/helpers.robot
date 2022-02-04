*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${BROWSER}      chrome
${URL}          http://localhost:3000/        #https://dev-trintareis.netlify.app/

*** Keywords ***
#### Setup e Teardown
Wait And Click  
    [Arguments]     ${element}
    Wait Until Element Is Visible       ${element}      10
    Click Element                       ${element}

Sleep And Click  
    [Arguments]     ${element}
    Wait Until Element Is Visible       ${element}      5
    Sleep                               2
    Click Element                       ${element}