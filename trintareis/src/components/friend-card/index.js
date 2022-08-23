import './friend-card.css';
import React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useStateIfMounted } from 'use-state-if-mounted';
import loading from '../../resources/loading.gif';
import firebase from '../../config/firebase';
import { notifyFriendInvite, findAndUpdateInviteNotification, notifyAcceptInvite, deleteFriendInviteNotifications } from '../../helpers/notification-helper';
import { inviteFriend, removeFriend, acceptInvite } from '../../helpers/friend-helper';


export default function FriendCard(props) {

    const [name, setName] = useStateIfMounted("loading");
    const [course, setCourse] = useStateIfMounted("loading");
    const [userType, setUserType] = useStateIfMounted("loading");
    const [cardButton, setCardButton] = useStateIfMounted(<button hidden={true}>button</button>);
    const [cardImage, setCardImage] = useStateIfMounted(loading);
    const [cardEmail, setCardEmail] = useStateIfMounted("loading");
    const [inviter, setInviter] = useStateIfMounted("loading");
    

    const emailUser = useSelector(state => state.emailUser);  
    const friends = firebase.firestore().collection('friends');  

    async function updateInfo(){ //método chamado na div principal ao montar componente
        
        setName( //<- carrega nome do usuário com link para o perfil
            <div>
                <Link to={props.email === emailUser ? `/profile` : `/profile/${props.profileId}`}> 
                    <div>
                        <span>{props.nome}</span>
                    </div>
                </Link>
            </div>     
        )    

        if (props.profilePhoto != null){ 
            firebase.storage().ref(`profile_images/`+ props.profilePhoto).getDownloadURL().then(url => setCardImage(url));    }

        if (props.course != null){  setCourse(props.course)       }
        if (props.type != null){    setUserType(props.type)       }
        if (props.email != null){   setCardEmail(props.email)     }
        
        chooseButton();        
    };


    function clickAction(){
        if(!props.isFriend){
            addFriend(cardEmail);
            setCardButton(<button className='card-button' onClick={clickAction}>Convidado</button>);
        } 
        else {
            if(props.pending == false){  
                unfriend(cardEmail);
                setCardButton(<button className='card-button' onClick={clickAction}>Conectar</button>)}
            else{
                if (inviter == emailUser){
                    findAndUpdateInviteNotification(emailUser, props.email)}
                else{
                    findAndUpdateInviteNotification(props.email, emailUser)}

                setCardButton(<button className='card-button' onClick={clickAction}>Desconectar</button>);
                acceptInvite(props.email, emailUser);
                notifyAcceptInvite(props.email, emailUser);
            }
        }
    }

    function chooseButton(){
        findInviter();
        if (!props.isFriend){
            setCardButton(<button className='card-button' onClick={clickAction}>Conectar</button>) }
        else { 
            if(props.pending == false){
                setCardButton(<button className='card-button' onClick={clickAction}>Desconectar</button>) } 
            else {
                if(props.email !== inviter){
                    setCardButton(<button className='card-button' onClick={clickAction}>Convidado</button>)}
                else {
                    setCardButton(<button className='card-button' onClick={clickAction}>Aceitar</button>)} }
        }
    }

    function findInviter(){
        friends.where("friend1", "==", emailUser).where("friend2", "==", props.email)
                .get().then(
                    (docs) => {
                        docs.forEach((doc) => {
                            setInviter(emailUser) })});
        
        friends.where("friend1", "==", props.email).where("friend2", "==", emailUser)
                .get().then(
                    (docs) => {
                        docs.forEach((doc) => {
                            setInviter(props.email)})});
    }

    return(
        <div onLoad={updateInfo}>
            <div className="friend-card">
                    <span className="friend-content">
                        <img className="friend-img" src={cardImage} />
                        <h4 className="friend-name">{name}</h4>
                        <p className="friend-course"><b>{course}</b> </p>
                        <p className="friend-usertype">{userType}</p>
                    </span>
                    {cardButton}
            </div>
        </div>
    )

    //funções dos botões
    function unfriend (friend_email){
        removeFriend(friend_email, emailUser);
        setCardButton(<button className='card-button'>Desconectado</button>);
        deleteFriendInviteNotifications(friend_email, emailUser);
    }

    function addFriend (friend_email){
        inviteFriend(friend_email, emailUser);
        notifyFriendInvite(friend_email,emailUser);
        setCardButton(<button className='card-button'>Solicitado</button>);
    }
}