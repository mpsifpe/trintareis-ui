import './friend-card.css';
import React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useStateIfMounted } from 'use-state-if-mounted';
import loading from '../../resources/loading.gif';
import firebase from '../../config/firebase';

export default function FriendCard(props) {

    const emailUser = useSelector(state => state.emailUser);

    const [name, setName] = useStateIfMounted("empty");
    const [course, setCourse] = useStateIfMounted("empty");    
    const [userType, setUserType] = useStateIfMounted("empty");
    const [cardButton, setCardButton] = useStateIfMounted(<button hidden={true}>button</button>);
    const [cardImage, setCardImage] = useStateIfMounted(loading);

    async function updateInfo(){
        setName(
            <div>
                <Link to={props.email === emailUser ? `/profile` : `/profile/${props.profileId}`}> 
                    <div>
                        <span>{props.nome}</span>
                    </div>
                </Link>
            </div>
        )    
        
        if (props.course != null){

            setCourse(props.course)     
        }

        if (props.type != null){
            setUserType(props.type)     
        }
        
        if(props.isFriend){
            setCardButton(<button className='card-button' onClick={clickAction}>Desconectar</button>)
        } else {
            setCardButton(<button className='card-button' onClick={clickAction}>Conectar</button>)
        }

        if (props.profilePhoto != null){
            firebase.storage().ref(`profile_images/`+ props.profilePhoto).getDownloadURL().then(url => setCardImage(url));
        }
    }



    function clickAction(){

        //exemplo
        if(props.isFriend){
            setCardButton(<button className='card-button'>Desconectado</button>)
        } else {
            setCardButton(<button className='card-button'>Solicitado</button>)
        }
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
};

/*
                    <div className="button-disconnect">
                        <Link> <span>Desconectar</span> </Link>
                    </div>
*/