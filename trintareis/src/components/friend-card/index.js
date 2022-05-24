import './friend-card.css';
import React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useStateIfMounted } from 'use-state-if-mounted';


export default function FriendCard(props) {
    
    const emailUser = useSelector(state => state.emailUser);

    const [name, setName] = useStateIfMounted("empty");
    const [course, setCourse] = useStateIfMounted("empty");    
    const [userType, setUserType] = useStateIfMounted("empty");

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
    }

    return(
        <div onLoad={updateInfo}>
            <div className="friend-card">
                    <span className="friend-content">
                        <img className="friend-img" src="/static/media/minios.8f62a453.jpg" />
                        <h4 className="friend-name">{name}</h4>
                        <p className="friend-usertype">{course}</p>
                        <p className="friend-course"><b>{userType}</b> </p>    
                    </span>
            </div>
        </div>
    )
};

/*
                    <div className="button-disconnect">
                        <Link> <span>Desconectar</span> </Link>
                    </div>
*/