import React, { useState, useEffect } from 'react';
import { BiLike } from "react-icons/bi";
import { CgComment } from "react-icons/cg";
import { FaShare } from "react-icons/fa";
import './feedPost.css'

import firebase from '../../config/firebase';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';

export default function (props) {
    const [urlImages, setUrlImages] = useState('');
    const emailUser = useSelector(state => state.emailUser);

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

                        <Link to={props.emailUser === emailUser ? `/profile` : `/profile/${props.profileId}`}>
                            <img src={props.profilePhoto} />
                        </Link>
                    </div>
                    <div className="div__info">
                    <Link to={props.emailUser === emailUser ? `/profile` : `/profile/${props.profileId}`}>
                            <div>
                                <span>{props.nome}</span>
                            </div>
                        </Link>
                        <div>
                            <span>{props.profileInformation}</span>
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