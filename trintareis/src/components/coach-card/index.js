import './coach-card.css';
import React, {useState} from 'react';

import loading from '../../resources/loading.gif';


export default function CoachCard(props) {

    const [name, setName] = useState("loading");
    const [profileInfo, setProfileInfo] = useState("");

    const [cardImage, setCardImage] = useState(loading);

    function updateInfo(){ //método chamado na div principal ao montar componente
        setName(<span className='friendcardLinkStyle'>{props.nome}</span>)    

        setCardImage(props.pic)
        setProfileInfo(props.profileInfo);
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
            </div>
        </div>
    )
}