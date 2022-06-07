import './friend-card.css';
import React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useStateIfMounted } from 'use-state-if-mounted';

import firebase from '../../config/firebase';


export default function FriendCard(props) {
    
    const storage = firebase.storage();
    const db = firebase.firestore();

    const emailUser = useSelector(state => state.emailUser);

    const [name, setName] = useStateIfMounted("empty");
    const [course, setCourse] = useStateIfMounted("empty");    
    const [userType, setUserType] = useStateIfMounted("empty");
    const [cardButton, setCardButton] = useStateIfMounted(<button hidden={true}>button</button>);

    function updateInfo(){
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
    }

    function clickAction(){
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
                        <img className="friend-img" src="/static/media/minios.8f62a453.jpg" />
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