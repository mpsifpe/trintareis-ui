import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiHeart, HiOutlineHeart, HiOutlineAnnotation, HiOutlineShare } from "react-icons/hi";
import './timeline.css'

import { isEmpty } from '../../helpers/helper';
import user from '../../resources/user.png';
import loading from '../../resources/loading.gif';
import firebase from '../../config/firebase';

export default function (props) {
    const [urlImages, setUrlImages] = useState(loading);
    
    useEffect(() => {
        const abortController = new AbortController()

        if (!isEmpty(props.img)){
            firebase.storage().ref(`images/${props.img}`).getDownloadURL().then(url => setUrlImages(url));
        } else {
            setUrlImages(null);
        }
        
        return function cleanup() {
            abortController.abort()
        }
    }, []);

    return (
        <div className="feedPost">
            <div className="feedPostSingle">
                <div className="feedPost__profile">
                    <div>
                        <Link to={{ pathname: ("/profile/" + props.profileId), 
                                    state: {
                                        firstLogin: props.stateFirstLogin, 
                                        profilePhoto: props.stateProfilePhoto, 
                                        coverPhoto: props.stateCoverPhoto, 
                                        userData: props.stateUserData }
                                }} style={{ textDecoration: 'none' }}>
                            <img src={props.profilePhoto} />
                        </Link>
                    </div>
                    <div className="div__info">
                        <Link to={{ pathname: ("/profile/" + props.profileId), 
                                    state: {
                                        firstLogin: props.stateFirstLogin, 
                                        profilePhoto: props.stateProfilePhoto, 
                                        coverPhoto: props.stateCoverPhoto, 
                                        userData: props.stateUserData }
                                }} style={{ textDecoration: 'none' }}>
                            <div>
                                <span>{props.nome}</span>
                            </div>
                        </Link>
                        <div>
                            <span>{props.horario}</span>
                        </div>
                    </div>
                </div>
                <div className="feedPost__content">
                    <p>
                        {props.conteudo}<br />
                    </p>

                    <img src={urlImages} />
                </div>
                <div className="div__info">
                    <div>
                    </div>
                </div>
                <hr />

                <div className="feedPost__util">
                    <div className="feedPost__reaction">
                        <HiOutlineHeart />
                        <span className="">Gostei</span>
                    </div>

                    <div className="feedPost__reaction">
                        <HiOutlineAnnotation />
                        <span>Comentar</span>
                    </div>

                    <div className="feedPost__reaction">
                        <HiOutlineShare />
                        <span>Compartilhar</span>
                    </div>
                </div>
            </div>
        </div>
    )
}