import './friend-card.css';
import { Link } from "react-router-dom";
import React, { useState } from 'react';


export default function FriendCard(props) {
    
    const [name, setName] = useState("empty");
    if (props.name != null){
        setName(props.name)    }

    const [course, setCourse] = useState("empty");
    if (props.course != null){
        setCourse(props.course)     }
    
    const [userType, setUserType] = useState("empty");
    if (props.type != null){
        setUserType(props.type)     }
    

    return(
        <div>
            <div className="friend-card">
                    <div className="friend-content">
                        <img className="friend-img" src="/static/media/minios.8f62a453.jpg" />
                        <h4 className="friend-name">{name}</h4>
                        <p className="friend-usertype">{userType}</p>
                        <p className="friend-course"><b>{course}</b> </p>    
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