import './friend-card.css';
import React, {useState, useContext} from 'react';
import { Link, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import loading from '../../resources/loading.gif';
import user from '../../resources/user.png';
import firebase from '../../config/firebase';
//import { notifyFriendInvite, findAndUpdateInviteNotification, notifyAcceptInvite, deleteFriendInviteNotifications } from '../../helpers/notification-helper';
import { isEmpty } from '../../helpers/helper';
import api from '../../config/api';
import NotyfContext from '../notyf-toast/NotyfContext';



export default function FriendCard(props) {

    const emailUser = useSelector(state => state.emailUser);  
    const storage = firebase.storage();
    const notyf = useContext(NotyfContext);
    let location = useLocation();

    const [idConnection, setIdConnection] = useState("");
    const [name, setName] = useState("loading");
    const [city, setCity] = useState("loading");
    const [inviter, setInviter] = useState("loading");
    const [isFriend, setIsFriend] = useState(false);
    const [pendingInvite, setPendingInvite] = useState(false);
    const [profileId, setProfileId] = useState("");

    const [cardImage, setCardImage] = useState(loading);
    const [cardEmail, setCardEmail] = useState("loading");
    const [cardButton, setCardButton] = useState(<div className='div__card-button'><button className='card-button'/></div>);

    async function updateInfo(){ //método chamado na div principal ao montar componente
        setName(
            <div>
                <Link to={"/profile" + "/" + props.profileId} className='friendcardLinkStyle'> 
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
        setProfileId(props.profileId)

        chooseButton();
    };

    function clickAction(){
        (isFriend) ? 
            (pendingInvite) ?    ( (inviter) ? unfriend() : acceptInvite() )    : unfriend()
        : addFriend()
    }

    function chooseButton(){
        if (isFriend){
            if(pendingInvite){
                if(inviter){
                    setCardButton(<div className='div__card-button'><button className='card-button' onClick={clickAction}>Convidado</button></div>)}
                else {
                    setCardButton(<div className='div__card-button'><button className='card-button' onClick={clickAction}>Aceitar</button></div>)}}
            else {
                setCardButton(<div className='div__card-button'><button className='card-button' onClick={clickAction}>Desconectar</button></div>)}}
        else { 
            setCardButton(<div className='div__card-button'><button className='card-button' onClick={clickAction}>Conectar</button></div>)}
    }
    
    return(
        <div onLoad={updateInfo}>         
            <div className="friend-card">
                    <span className="friend-content">
                        <Link to={{ pathname: '/profile/' + profileId, state: { firstLogin: location.state.firstLogin, profilePhoto: location.state.profilePhoto, coverPhoto: location.state.coverPhoto, userData: location.state.userData } }} style={{textDecoration: "none"}}>
                            <img className="friend-img" src={cardImage} alt="user image"/>
                            <div>{name}</div>
                            <p className="friend-course">{city}</p>
                            <p className="friend-usertype">{cardEmail}</p>
                        </Link>
                    </span>
                    <div>{cardButton}</div>
            </div>
        </div>
    )

    //--------------------------------------------------------------------------------------------------/
    //funções dos botões
    function unfriend (){

        api.delete('/friends', {
            params : {
                idConnection : idConnection
            }
        })
        .then(()=>{
            notyf.success("Conexão desfeita");
            setCardButton(<div className='div__card-button'><button className='card-button'>Conectar</button></div>);
        })
        .catch(function (error) {
            console.log(error);
            notyf.error("Desculpe, ocorreu um erro");
        })
    }

    function addFriend (){

        api.post('/friends/create', {
            userEmailFriend: cardEmail,
            userEmail: emailUser
        })
        .then(()=>{
            setCardButton(<div className='div__card-button'><button className='card-button'>Convidado</button></div>);
            notyf.success("Solicitação de amizade enviada");
        })
        .catch(function (error) {
            console.log(error);
            notyf.error("Desculpe, ocorreu um erro");
        })
        //notifyFriendInvite(cardEmail,emailUser);

    }

    function acceptInvite(){
        api.put('/friends?id=' + idConnection)
        .then((response)=>{
            notyf.success("Convite aceito");
            setCardButton(<div className='div__card-button'><button className='card-button'>Desconectar</button></div>);
            //findAndUpdateInviteNotification(cardEmail, emailUser);
            //notifyAcceptInvite(cardEmail, emailUser);  
        })
        .catch(function (error) {
            console.log(error);
            notyf.error("Desculpe, ocorreu um erro"); 
        })
    }
}