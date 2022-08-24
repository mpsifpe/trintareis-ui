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
    const [cardButton, setCardButton] = useStateIfMounted(<div className='div__card-button'><button className='card-button'>Carregando</button></div>);
    const [cardImage, setCardImage] = useStateIfMounted(loading);
    const [cardEmail, setCardEmail] = useStateIfMounted("loading");
    const [inviter, setInviter] = useStateIfMounted("loading");
    const [isFriend, setIsFriend] = useStateIfMounted(false);
    const [pendingInvite, setPendingInvite] = useStateIfMounted(false);
    

    const emailUser = useSelector(state => state.emailUser);  
    const friends = firebase.firestore().collection('friends');  

    async function updateInfo(){ //método chamado na div principal ao montar componente
        setName(
            <div>
                <Link to={props.email === emailUser ? `/profile` : `/profile/${props.profileId}`} className='friendcardLinkStyle'> 
                    <span >{props.nome}</span>
                </Link>
            </div>     
        )    

        if (props.profilePhoto != null){ 
            firebase.storage().ref(`profile_images/`+ props.profilePhoto).getDownloadURL().then(url => setCardImage(url));    }

        if (props.course != null){  setCourse(props.course)       }
        if (props.type != null){    setUserType(props.type)       }
        if (props.email != null){   setCardEmail(props.email)     }
        
        setIsFriend(props.isFriend);
        setPendingInvite(props.pending);   

        chooseButton();
    };

    function clickAction(){
        if(isFriend === false){
            addFriend();
            setIsFriend(true);
            setPendingInvite(true);
            setCardButton(<div className='div__card-button'><button className='card-button'>Convidado</button></div>)
            console.log("click> convidado")
        } 
        else {
            if(pendingInvite == false){  
                unfriend();
                setIsFriend(false);
                setCardButton(<div className='div__card-button'><button className='card-button'>Conectar</button></div>) 
                console.log("click> desconectado")
            }
            else{
                if (inviter === emailUser){
                    unfriend();
                    setIsFriend(false);
                    setPendingInvite(false);
                    setCardButton(<div className='div__card-button'><button className='card-button'>Convite cancelado</button></div>);
                    console.log("click> desconectado")
                }
                else{
                    findAndUpdateInviteNotification(cardEmail, emailUser);
                    setIsFriend(true);
                    setPendingInvite(false);
                    acceptInvite(cardEmail, emailUser);
                    notifyAcceptInvite(cardEmail, emailUser);
                    setCardButton(<div className='div__card-button'><button className='card-button'>Desconectar</button></div>)
                    console.log("click> aceito")
                }                
            }
        }
    }

    function chooseButton(){
        findInviter();
        if (isFriend === false){
            setCardButton(<div className='div__card-button'><button className='card-button' onClick={clickAction}>Conectar</button></div>) }
        else { 
            if(pendingInvite === false){
                setCardButton(<div className='div__card-button'><button className='card-button' onClick={clickAction}>Desconectar</button></div>) } 
            else {
                if(inviter === emailUser){
                    setCardButton(<div className='div__card-button'><button className='card-button' onClick={clickAction}>Convidado</button></div>)}
                else {
                    setCardButton(<div className='div__card-button'><button className='card-button' onClick={clickAction}>Aceitar</button></div>)} 
            }
        }
    }

    function findInviter(){
        friends.where("friend1", "==", emailUser).where("friend2", "==", props.email)
                .get().then(
                    (docs) => {
                        docs.forEach((doc) => {
                            setInviter(emailUser)})});
        
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
                        <Link to={cardEmail === emailUser ? `/profile` : `/profile/${props.profileId}`}> 
                            <img className="friend-img" src={cardImage} />
                        </Link>
                        <div>{name}</div>
                        <p className="friend-course">{course}</p>
                        <p className="friend-usertype">{userType}</p>
                    </span>
                    {cardButton}
            </div>
        </div>
    )

    //funções dos botões
    function unfriend (){
        removeFriend(cardEmail, emailUser);
        deleteFriendInviteNotifications(cardEmail, emailUser);
    }

    function addFriend (){
        inviteFriend(cardEmail, emailUser);
        notifyFriendInvite(cardEmail,emailUser);
    }
}