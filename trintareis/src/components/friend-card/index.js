import './friend-card.css';
import React, {useState, useContext} from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import loading from '../../resources/loading.gif';
import user from '../../resources/user.png';
import firebase from '../../config/firebase';
import { notifyFriendInvite, findAndUpdateInviteNotification, notifyAcceptInvite, deleteFriendInviteNotifications } from '../../helpers/notification-helper';
import { isEmpty } from '../../helpers/helper';
import api from '../../config/api';
import NotyfContext from '../notyf-toast/NotyfContext';

const storage = firebase.storage();

export default function FriendCard(props) {

    const emailUser = useSelector(state => state.emailUser);  
    const notyf = useContext(NotyfContext);

    const [idConnection, setIdConnection] = useState("");
    const [name, setName] = useState("loading");
    const [city, setCity] = useState("loading");
    const [inviter, setInviter] = useState("loading");
    const [isFriend, setIsFriend] = useState(false);
    const [pendingInvite, setPendingInvite] = useState(false);

    const [cardImage, setCardImage] = useState(loading);
    const [cardEmail, setCardEmail] = useState("loading");
    const [cardButton, setCardButton] = useState(<div className='div__card-button'><button className='card-button'/></div>);

    async function updateInfo(){ //método chamado na div principal ao montar componente
        setName(
            <div>
                <Link to={"/profile/" + props.profileId} className='friendcardLinkStyle'> 
                    <span >{props.nome}</span>
                </Link>
            </div>     
        )    

        if(!isEmpty(props.profilePhoto)) { 
            storage.ref("profile_images/" + props.profilePhoto).getDownloadURL()
            .then(url => setCardImage(url))
            .catch(()=>{setCardImage(user)})}
        else {setCardImage(user)}
        
        setIdConnection(props.idConnection)
        setCity(props.city)
        setCardEmail(props.email)
        setIsFriend(props.isFriend);
        setPendingInvite(props.pending);
        setInviter(props.inviter)

        chooseButton();
    };

    function clickAction(){
        if(!isFriend){
            addFriend();
        } 
        else {
            if(pendingInvite == false){  
                unfriend();
            }
            else{
                if (inviter === emailUser){
                    unfriend();
                    setIsFriend(false);
                    setPendingInvite(false);
                    chooseButton();
                    console.log("click> desconectado")
                }
                else{
                    //findAndUpdateInviteNotification(cardEmail, emailUser);
                    acceptInvite();
                    //notifyAcceptInvite(cardEmail, emailUser);
                    chooseButton();
                    console.log("click> aceito")
                }                
            }
        }
    }

    function chooseButton(){
        if (!isFriend){
            setCardButton(<div className='div__card-button'><button className='card-button' onClick={clickAction}>Conectar</button></div>) }
        else { 
            if(!pendingInvite){
                setCardButton(<div className='div__card-button'><button className='card-button' onClick={clickAction}>Desconectar</button></div>) } 
            else {
                if(inviter){
                    setCardButton(<div className='div__card-button'><button className='card-button' onClick={clickAction}>Convidado</button></div>)}
                else {
                    setCardButton(<div className='div__card-button'><button className='card-button' onClick={clickAction}>Aceitar</button></div>)} 
            }
        }
    }

    

    return(
        <div onLoad={updateInfo}>
            <div className="friend-card">
                    <span className="friend-content">
                        <Link to={"/profile" + props.profileId} style={{textDecoration: "none"}}> 
                            <img className="friend-img" src={cardImage} />
                            <div>{name}</div>
                            <p className="friend-course">{city}</p>
                            <p className="friend-usertype">{cardEmail}</p>
                        </Link>
                    </span>
                    {cardButton}
            </div>
        </div>
    )

    //--------------------------------------------------------------------------------------------------/
    //funções dos botões
    function unfriend (){
        api.delete('/friends', {
            params : {
                idConnection: idConnection
            }
        })
        .then(()=>{
            setIsFriend(false);
            setPendingInvite(true);
            chooseButton();
            notyf.success("Conexão desfeita")
        })
        .catch(function (error) {
            console.log(error);
            notyf.error("Desculpe, ocorreu um erro")
            chooseButton();
        });
    }

    function addFriend (){
        api.post('/friends/create', {
            params : {
                userEmailFriend: cardEmail,
                userEmail: emailUser
            }
        })
        .then(()=>{
            setIsFriend(true);
            setPendingInvite(true);
            chooseButton();
            notyf.success("Solicitação de amizade enviada")
        })
        .catch(function (error) {
            console.log(error);
            notyf.error("Desculpe, ocorreu um erro")
            chooseButton();
        });
        //notifyFriendInvite(cardEmail,emailUser);
    }

    function acceptInvite(){
        api.put('/friends', {
            params : {
                id: idConnection
            }
        })
        .then(()=>{
            setIsFriend(true);
            setPendingInvite(false);
            chooseButton();
        })
        .catch(function (error) {
            console.log(error);
            notyf.error("Desculpe, ocorreu um erro")
        });
    }
}