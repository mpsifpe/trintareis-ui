import stayled from 'styled-components';

export const Perfil = stayled.label`
    cursor: pointer;
    margin-left: 25px;
    position: relative;
    padding: 4px 10px;
    background-color: rgb(35, 136, 231);
    color: white;
    font-weight: bolder;
    border-radius: 10px;
    htmlFor: upload-button;
`;

export const DivMain = stayled.div`
    margin-left: 10%;
    background-color: rgb(58, 56, 56);
    background-repeat: no-repeat;
    background-image: url(${props => `${props.photo}`});
    // background-image: url(https://media.istockphoto.com/photos/smiling-indian-business-man-working-on-laptop-at-home-office-young-picture-id1307615661?b=1&k=20&m=1307615661&s=170667a&w=0&h=Zp9_27RVS_UdlIm2k8sa8PuutX9K3HTs8xdK0UfKmYk=);
    background-size: cover;
    position: relative;
    width: 80%;
    border-radius: 15px;
    padding: 100px;
    margin-top: 15px;
    display: flex;
    flex-direction: column;
`;