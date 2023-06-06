import './coach-card.css';
import React, {useState, useContext} from 'react';

import loading from '../../resources/loading.gif';
import user from '../../resources/user.png';
import firebase from '../../config/firebase';

import { isEmpty, isURL } from '../../helpers/helper';
import NotyfContext from '../notyf-toast/NotyfContext';


export default function CoachCard(props) {

    const storage = firebase.storage();
    const notyf = useContext(NotyfContext);

    const [idConnection, setIdConnection] = useState("");
    const [name, setName] = useState("loading");
    const [city, setCity] = useState("loading");
    const [details, setDetails] = useState("");
    const [profileId, setProfileId] = useState("");
    const [profileInfo, setProfileInfo] = useState("");
    const [profileType, setProfileType] = useState("");

    const [cardImage, setCardImage] = useState(loading);
    const [cardEmail, setCardEmail] = useState("loading");
    const [message, setMessage] = useState(<></>)

    function updateInfo(){ //método chamado na div principal ao montar componente
        setName(<span className='friendcardLinkStyle'>{props.nome}</span>)    

        setCardImage(props.pic)
        
        setIdConnection(props.idConnection);
        setCity(props.city);
        setCardEmail(props.email);
        setDetails(props.details);
        setProfileId(props.profileId);
        setProfileInfo(props.profileInfo);
        setProfileType(props.profileType);
    };



    return(
        <div onLoad={updateInfo}>         
            <div className="friend-card">                    
                    <span className="friend-content">
                        <img className="friend-img" src={cardImage} alt="user image"/>
                        <div>{name}</div>
                        <p className="friend-course">{profileInfo}</p>
                    </span>
                    <div className='div__card-button'>
                        <button className='card-button'>Detalhes</button>
                    </div>
                    <span>{message}</span>
            </div>
        </div>
    )
}