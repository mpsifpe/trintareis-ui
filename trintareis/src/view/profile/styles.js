import styled from 'styled-components';

export const Perfil = styled.div`
    margin-left: 10%;
    background-color: white;
    background-repeat: no-repeat;
    background-image: url(${props => `${props.photo}`});
    background-size: cover;
    position: relative;
    width: 80%;
    height: 400px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    padding: 135px;
    margin-top: 10px;
    display: flex;

    label {
        display: flex;
        justify-content: center;
        width: 250px;
        cursor: pointer;
        margin-top: -90px;
        margin-left: 720px;
        position: relative;
        padding: 4px 10px;
        background-color: rgb(35, 136, 231);
        color: white;
        font-weight: bolder;
        border-radius: 5px;
        htmlFor: upload-button;
    }
`;

export const Content = styled.div`
    background: white;
    margin-left: 10%;
    background-color: white;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    width: 80%;
    padding-left: 50px;
    display: flex;

    .div__foto{
        background: white;
        background-image: url(${props => `${props.photoProfile}`});
        border-radius: 50% !important;
        width: 200px;
        height: 200px;
        overflow: hidden;
        object-fit: cover;
        display: flex;
        background-size: cover;
        background-position: 50% 50%;
        border-color: #aaa !important;
        border: 0px;
        margin-top: -150px;
    }

    .div__main_form{
        justify-content: flex-start;
    }

    .div__main_form span{
        margin-left: -25px;
        font-size: 35px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: bold;
        font-style: normal;
        text-decoration: none;
    }

    .div__main_form label{
        margin-left: 10px;
        border: 1.8px solid;
        width: 70px;
        border-radius: 15px;
        text-align: center;
        color: blue;
        cursor: pointer;
    }

    .div__main_form p{
        margin-left: -25px;
    }

    .p__region{
        color: gray;
        font-size: 15px;
        margin-top: -17px
    }
`;

export const Details = styled.div`
    margin-left: 10%;
    background-color: white;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    border-radius: 15px;
    width: 80%;
    padding-left: 50px;
    padding-bottom: 10px;
    margin-top: 10px;
    

    .div__span {
        margin-left: -25px;
        font-size: 35px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: bold;
        font-style: normal;
        text-decoration: none;
    }

    .div__p {
        margin-left: -25px;
        margin-top: 25px;
    }

    span {
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size: 25px;
    }
`;

export const Dropdown = styled.div`
    margin-left: 10%;
    background-color: white;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    width: 80%;
    padding-left: 50px;
    padding-bottom: 10px;

    .div__dropdown{
        margin-left: 87%;
        width: 90px;
        border: 5px solid white;
        border-radius: 2px;
    }
`;