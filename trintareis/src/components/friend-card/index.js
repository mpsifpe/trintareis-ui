import './friend-card.css';
import React, {useState, useContext} from 'react';
import { Link, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import loading from '../../resources/loading.gif';
import user from '../../resources/user.png';
import firebase from '../../config/firebase';
import { notifyFriendInvite, findAndUpdateInviteNotification, notifyAcceptInvite } from '../../helpers/notification-helper';
import { isEmpty, isURL } from '../../helpers/helper';
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
    const [details, setDetails] = useState("");
    const [inviter, setInviter] = useState("loading");
    const [isFriend, setIsFriend] = useState(false);
    const [pendingInvite, setPendingInvite] = useState(false);
    const [profileId, setProfileId] = useState("");
    const [profileInfo, setProfileInfo] = useState("");
    const [profileType, setProfileType] = useState("");

    const [cardImage, setCardImage] = useState(loading);
    const [cardEmail, setCardEmail] = useState("loading");
    const [cardButton, setCardButton] = useState(<button className='card-button'/>);

    function updateInfo(){ //método chamado na div principal ao montar componente
        setName(<span className='friendcardLinkStyle'>{props.nome}</span>)    

        if(isEmpty(props.profilePhoto)) {
            setCardImage(user)
        }
        else {
            if(isURL(props.profilePhoto)){
                setCardImage(props.profilePhoto)
            }
            else{
                storage.ref("profile_images/" + props.profilePhoto).getDownloadURL()
                .then(url => setCardImage(url))
                .catch(()=>{setCardImage(user)})
            }  
        }
        
        setIdConnection(props.idConnection);
        setCity(props.city);
        setCardEmail(props.email);
        setDetails(props.details);
        setIsFriend(props.isFriend);
        setPendingInvite(props.pending);
        setInviter(props.inviter);
        setProfileId(props.profileId);
        setProfileInfo(props.profileInfo);
        setProfileType(props.profileType);

        chooseButton();
    };

    function clickAction(){
        (isFriend) ? 
            (pendingInvite) ?    ( (inviter) ? unfriend() : acceptInvite() )    : unfriend()
        : addFriend()
    }

    function chooseButton(){
        switch(profileType){

            case "INSTITUTIONAL":
                setCardButton(
                    <Link to={{ pathname: '/institution/' + profileId, state: { firstLogin: location.state.firstLogin, profilePhoto: location.state.profilePhoto, coverPhoto: location.state.coverPhoto, userData: location.state.userData, origin:"friend-card" } }} style={{textDecoration: "none"}}>
                        <button className='card-button'>Conhecer</button>
                    </Link>
                )
                break;

            case "PERSONAL":
                if (isFriend){
                    if(pendingInvite){
                        if(inviter){
                            setCardButton(<button className='card-button' onClick={clickAction} onMouseOver={mouseHover} onMouseLeave={mouseLeave}>Convidado</button>)}
                        else {
                            setCardButton(<button className='card-button' onClick={clickAction}>Aceitar</button>)}}
                    else {
                        setCardButton(<button className='card-button' onClick={clickAction}>Desconectar</button>)}}
                else { 
                    setCardButton(<button className='card-button' onClick={clickAction}>Conectar</button>)}
        }
    }
    
    return(
        <div onLoad={updateInfo}>         
            <div className="friend-card">
                    <Link to={{ pathname: '/profile/' + profileId, state: { firstLogin: location.state.firstLogin, profilePhoto: location.state.profilePhoto, coverPhoto: location.state.coverPhoto, userData: location.state.userData, origin:"friend-card" } }} style={{textDecoration: "none"}}>
                        <span className="friend-content">
                            <img className="friend-img" src={cardImage} alt="user image"/>
                            <div>{name}</div>
                            <p className="friend-course">{profileInfo}</p>
                        </span>
                    </Link>
                    
                    <div className='div__card-button'>{cardButton}</div>
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
            setCardButton(<button className='card-button'>Conectar</button>);
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
            setCardButton(<button className='card-button'>Convidado</button>);
            notyf.success("Solicitação de amizade enviada");
        })
        .catch(function (error) {
            console.log(error);
            notyf.error("Desculpe, ocorreu um erro");
        })
    }

    function acceptInvite(){
        api.put('/friends?id=' + idConnection)
        .then(()=>{
            notyf.success("Convite aceito");
            setCardButton(<button className='card-button'>Desconectar</button>);
            findAndUpdateInviteNotification(cardEmail, emailUser);
        })
        .catch(function (error) {
            console.log(error);
            notyf.error("Desculpe, ocorreu um erro"); 
        })
    }

    function mouseHover(){
        if (profileType==="PERSONAL"){
            if (isFriend){
                if(pendingInvite){
                    if(inviter){
                        setCardButton(<button className='card-button' onClick={clickAction} onMouseOver={mouseHover} onMouseLeave={mouseLeave}>Cancelar convite</button>)}}
            }
        }
    }

    function mouseLeave(){
        if (profileType==="PERSONAL"){
            if (isFriend){
                if(pendingInvite){
                    if(inviter){
                        setCardButton(<button className='card-button' onClick={clickAction} onMouseOver={mouseHover} onMouseLeave={mouseLeave}>Convidado</button>)}
                }
            }
        }
    }
}