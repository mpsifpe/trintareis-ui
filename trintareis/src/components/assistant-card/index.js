import './assistant-card.css';
import React, {useState, useContext} from 'react';
import { Link, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import loading from '../../resources/loading.gif';
import user from '../../resources/user.png';
import firebase from '../../config/firebase';
import { isEmpty } from '../../helpers/helper';
import api from '../../config/api';
import NotyfContext from '../notyf-toast/NotyfContext';



export default function AssistantCard(props) {

    const emailUser = useSelector(state => state.emailUser);  
    const storage = firebase.storage();
    const notyf = useContext(NotyfContext);
    let location = useLocation();

    const [name, setName] = useState("loading");
    const [job, setJob] = useState("loading");
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
        
        //setIdConnection(props.idConnection)
        setJob(props.city)
        setCardEmail(props.email)
        //setProfileId(props.profileId)
    };

    function clickAction(){
        console.log("click")
    }

    
    return(
        <div onLoad={updateInfo}>         
            <div className="friend-card">
                    <span className="friend-content">
                        <Link to={{ pathname: '/profile/' + profileId, state: { firstLogin: location.state.firstLogin, profilePhoto: location.state.profilePhoto, coverPhoto: location.state.coverPhoto, userData: location.state.userData } }} style={{textDecoration: "none"}}>
                            <img className="friend-img" src={cardImage} alt="user image"/>
                            <div>{name}</div>
                            <p className="friend-course">{job}</p>
                            <p className="friend-usertype">{cardEmail}</p>
                        </Link>
                    </span>
                    <div>{cardButton}</div>
            </div>
        </div>
    )
}