import React, { useState, useEffect } from 'react';
import { BiLike } from "react-icons/bi";
import { CgComment } from "react-icons/cg";
import { FaShare } from "react-icons/fa";
import './feedPost.css'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import firebase from '../../config/firebase';

export default function (props) {
    const [urlImages, setUrlImages] = useState('');
    const emailUser = useSelector(state => state.emailUser);
    const [curtir, setCurti] = useState('');
    const [curtiu, setCurtiu] = useState('');

    const [compartilhar, setCompartilhar] = useState('');
    const [compartilhou, setCompartilhou] = useState('');

    useEffect(() => {
        const abortController = new AbortController()
        firebase.storage().ref(`images/${props.img}`).getDownloadURL().then(url => setUrlImages(url));
        setCurti(props.like.length);

        props.like.forEach(function (like) {
            if (like == emailUser) {
                setCurtiu(1);
            }
        })

        props.share.forEach(function (share) {
            if (share == emailUser) {
                compartilhou(1);
            }
        })

        return function cleanup() {
            abortController.abort()
        }
    }, []);

    function funcCurtir() {
        alert('Você já curtiu');
    }

    function funcCompartilhou() {
        alert('Você já compartilhou');
    }

    function funcGostei(obj) {
        let evento = firebase.firestore().collection('events');
        var likes = [];
        evento.get().then(async (result) => {
            await result.docs.forEach(doc => {
                if (doc.id == obj.id) {
                    likes = doc.data().like;
                    if (likes.length >= 0) {
                        likes.push(emailUser);
                        evento.doc(obj.id).update({
                            like: likes
                        })
                    }
                }
            })
        })
        window.location.reload(false);
        /*firebase.firestore().collection('events').doc(idPubl).set({
            amountComment: 0,
            data: "2022-04-11",
            dataTime: 1650682444189,
            details: "Evento agilista.",
            emailUser: "marcos@email.com",
            hour: "20:00",
            like: 11,
            photo: "Screenshot_3.png",
            public: 1,
            share: 0,
            title: "Agile Trend",
            type: "Presencial",
            views: 0,
        });
        */
    }



    function funcCompartilhar(obj) {
        let evento = firebase.firestore().collection('events');
        var share = [];
        evento.get().then(async (result) => {
            await result.docs.forEach(doc => {
                if (doc.id == obj.id) {
                    share = doc.data().share;
                    if (share.length >= 0) {
                        share.push(emailUser);
                        evento.doc(obj.id).update({
                            share: share
                        })
                    }
                }
            })
        })
    }






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
                                <a>{props.nome}</a>
                            </Link>
                        </div>
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
                        {/* <Link to={'/detailsEvents/' + props.id} className="feed__details">...ver mais</Link> */}
                    </p>

                    <img src={urlImages} />
                </div>
                <div className="div__info">
                    <div>
                        <span>
                            <BiLike />{curtir} curtidas</span>
                    </div>
                </div>
                <hr />

                <div className="feedPost__util">
                    <div className="feedPost__reaction">

                        <BiLike />
                        {
                            (curtiu > 0) ?
                                <span onClick={() => funcCurtir()} className="">Gostei</span>
                                :
                                <span onClick={() => funcGostei({ id: props.id })} className="">Gostei</span>
                        }

                    </div>

                    <div className="feedPost__reaction">
                        <CgComment />
                        <span>Comentar</span>
                    </div>

                    <div className="feedPost__reaction">
                        <FaShare />
                        {
                            (compartilhou > 0) ?
                                <span onClick={() => funcCompartilhou()} className="">Compartilhar</span>
                                :
                                <span onClick={() => funcCompartilhar({ id: props.id })} className="">Compartilhar</span>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}