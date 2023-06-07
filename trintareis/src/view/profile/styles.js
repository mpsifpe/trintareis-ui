import styled from 'styled-components';

export const Perfil = styled.div`
    background-color: #45bd62;
    background-repeat: no-repeat;
    background-image: url(${props => `${props.cover}`});
    background-size: cover;
    position: relative;
    width: 100%;
    height: 45vh;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    padding: 135px;
    margin-top: 10px;
    display: flex;
`;

export const Content = styled.div`
    background: white;
    background-color: white;
    background-repeat: no-repeat;
    background-size: cover;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    width: 100%;
    padding-left: 50px;
    padding-bottom: 40px;

    .div__foto{
        background: white;
        background-image: url(${props => `${props.photoProfile}`});
        border-radius: 50%;
        width: 200px;
        height: 200px;
        overflow: visible;
        object-fit: cover;
        display: flex;
        background-size: cover;
        background-position: 50% 50%;
        border: 0px;
        margin-top: -150px;
    }
`;

export const Details = styled.div`
    padding-left: 0;
    background-color: white;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 15px;
    width: 100%;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
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