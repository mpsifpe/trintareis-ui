import './friend-card.css';
import { Link } from "react-router-dom";
import React, { useState } from 'react';


export default function FriendCard(props) {
    
    const [name, setName] = useState("empty");
    const [course, setCourse] = useState("empty");    
    const [userType, setUserType] = useState("empty");


    function userInfo(){
        if (props.nome != null){
            setName(props.nome)    
        }
        if (props.course != null){

            setCourse(props.course)     
        }
        if (props.type != null){
            setUserType(props.type)     
        }
        
    };

    userInfo();

    return(
        <div>
            <div className="friend-card">
                    <div className="friend-content">
                        <img className="friend-img" src="/static/media/minios.8f62a453.jpg" />
                        <h4 className="friend-name">{name}</h4>
                        <p className="friend-usertype">{course}</p>
                        <p className="friend-course"><b>{userType}</b> </p>    
                    </div>

            </div>
        </div>
    )
}

/*

                <div className="button-disconnect">
                    <Link> <span>Desconectar</span> </Link>
                </div>
*/