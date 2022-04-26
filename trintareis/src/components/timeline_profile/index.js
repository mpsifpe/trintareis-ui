import React, { useState, useEffect } from 'react';
import minios_bg from '../../resources/minios.jpg';
import { BiLike } from "react-icons/bi";
import { CgComment } from "react-icons/cg";
import { FaShare } from "react-icons/fa";
import './timeline.css'

import { Link } from 'react-router-dom';

import firebase from '../../config/firebase';

export default function (props) {
    const [urlImages, setUrlImages] = useState('');
    
    useEffect(() => {
        const abortController = new AbortController()

        firebase.storage().ref(`images/${props.img}`).getDownloadURL().then(url => setUrlImages(url));

        return function cleanup() {
            abortController.abort()
        }
    }, []);

    return (
        <div className="feedPost">
            <div className="feedPostSingle">
                <div className="feedPost__profile">
                    <div>
                        <Link to="profile">
                            <img src={props.profilePhoto} />
                        </Link>
                    </div>
                    <div className="div__info">
                        <div>
                            <Link to="profile">
                                <a>{props.userName}</a>
                            </Link>
                        </div>
                        <div>
                            <span>{props.profileInf}</span>
                        </div>
                        <div>
                            <span>{props.horario}</span>
                        </div>
                    </div>
                </div>
                <div className="feedPost__content">
                    <h2 className='p-3'>{props.title}</h2>
                    <p>
                        {props.conteudo}<br />
                    </p>

                    <img src={urlImages} />
                </div>

                <hr />

                <div className="feedPost__util">
                    <div className="feedPost__reaction">
                        <BiLike />
                        <span className="">Gostei</span>
                    </div>

                    <div className="feedPost__reaction">
                        <CgComment />
                        <span>Comentar</span>
                    </div>

                    <div className="feedPost__reaction">
                        <FaShare />
                        <span>Compartilhar</span>
                    </div>
                </div>
            </div>
        </div>
    )
}