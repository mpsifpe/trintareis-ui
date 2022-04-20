import stayled from 'styled-components';

export const Perfil = stayled.div`
    margin-left: 10%;
    background-color: rgb(124, 129, 123);
    background-repeat: no-repeat;
    background-image: url(${props => `${props.photo}`});
    background-size: cover;
    position: relative;
    width: 80%;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    padding: 100px;
    margin-top: 15px;
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

// export const DivMain = stayled.div``;

export const Content = stayled.div`
    background: red;
    margin-left: 10%;
    background-color: white;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    width: 80%;
    padding: 100px;
    // margin-top: 15px;
    display: flex;

    .div__foto{
        background: rgb(160, 235, 160);
        width: 200px;
        height: 200px;
        margin-top: -210px;
        margin-left: -35px;
        border-radius: 50%;
        border: 5px solid white;
    }

    .div__main_form{
        margin: 5px;
        justify-content: space-between;
    }

    .div__main_form span{
        margin-left: -35px;
        font-size: 30px;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
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
        margin-left: -35px;
    }
`;
