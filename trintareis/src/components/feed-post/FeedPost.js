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
    const [element, setElement] = useState('');
    const [elementComentarios, setElementComentarios] = useState('');


    // .log(state.emailUser);


    useEffect(() => {
        const abortController = new AbortController()
        firebase.storage().ref(`images/${props.img}`).getDownloadURL().then(url => setUrlImages(url));

        if (Array.isArray(props.like) && props.like.length > 0) {
            setCurti(props.like.length);
            props.like.forEach(function (like) {
                if (like == emailUser) {
                    setCurtiu(1);
                }
            })
        } else {
            setCurti(1);
            setCurtiu(0);
        }


        if (Array.isArray(props.share) && props.share.length > 0) {
            setCompartilhar(props.share.length);
            props.share.forEach(function (share) {
                if (share == emailUser) {
                    setCompartilhou(1);
                }
            })
        } else {
            setCompartilhar(1);
            setCompartilhou(0);
        }

        if (Array.isArray(props.coments) && props.coments.length > 0) {
            var retorno = "";
            props.coments.forEach(function (coment) {
                let object1 = JSON.parse(coment);

               // console.log(coment);
                retorno += '<span>aaa' + object1 + '</span>';

           })
            setElementComentarios(
                retorno
            );


        }















        return function cleanup() {
            abortController.abort()
        }
    }, []);

    function salvaComentario(obj) {
        console.log('Id: ' + obj.id);
        console.log('Id: ' + obj);
        let evento = firebase.firestore().collection('events');

        /* evento.doc(obj.id).update({
                coments: null
            })
            return false;*/
        var comentarios = [];
        evento.get().then(async (result) => {
            await result.docs.forEach(doc => {
                let comentario = ['tiago', 'email', 'oi, eu sou o goku', 'data'];
                comentario = JSON.stringify(comentario);
                if (doc.id == obj.id) {
                    if (doc.data().coments == '') {
                        evento.doc(obj.id).update({
                            coments: comentario
                        })
                    } else if (doc.data().coment != '' && !Array.isArray(doc.data().coments)) {
                        comentarios.push(doc.data().coments);
                        comentarios.push(comentario);
                        evento.doc(obj.id).update({
                            coments: comentarios
                        })
                    } else {
                        comentarios = doc.data().coments;
                        comentarios.push(comentario);
                        evento.doc(obj.id).update({
                            coments: comentarios
                        })
                    }


                }
            });
        });








        alert('salvar comentario');
    }


    function comentarios(obj) {
        var id = obj.id;


        let evento = firebase.firestore().collection('events');
        var likes = [];
        evento.get().then(async (result) => {
            await result.docs.forEach(doc => {
                if (doc.id == obj.id) {
                    doc.data().coments.forEach(function (coment) {

                        let object1 = JSON.parse(coment);
                        console.log(object1);
                        let objeto = [];
                        objeto.push('aaaa');

                        // console.log(doc.data().coments);
                        console.log('1' + elementComentarios);

                    })



                }
            })
        })




        setElement(
            <div>
                <h5>Comentários</h5>
                <div className='feedPost__util feed__coments'>
                    <input id="textComent" type="textComent" class="form-control my-2" placeholder="Comentário" />
                    <button id="login2_enter_btn" onClick={() => salvaComentario({ id })} className="w-10 btn btn-coments fw-bold bor" type="button">enviar</button>
                </div>
            </div>
           , {elementComentarios}
        );
    }



    function funcGostei(obj) {

        let evento = firebase.firestore().collection('events');
        /*  evento.doc(obj.id).update({
             like: 'dfasdf@adfasdf'
         })
         return false;*/
        var likes = [];
        evento.get().then(async (result) => {
            await result.docs.forEach(doc => {

                if (doc.id == obj.id) {

                    var retorno = true;
                    if (Array.isArray(doc.data().like)) {
                        doc.data().like.forEach(function (like) {
                            if (like == emailUser) {
                                alert('Você já curtiu');
                                retorno = false;
                            }
                        })
                    } else {
                        if (doc.data().like == emailUser) {
                            alert('Você já curtiu.');
                            retorno = false;
                        }
                    }
                    if (retorno) {
                        if (doc.data().like == '') {
                            evento.doc(obj.id).update({
                                like: emailUser
                            })
                        } else if (doc.data().like != '' && !Array.isArray(doc.data().like)) {
                            setCurti(doc.data().like.length + 1);
                            likes.push(doc.data().like);
                            likes.push(emailUser);
                            evento.doc(obj.id).update({
                                like: likes
                            })
                        } else {
                            setCurti(doc.data().like.length + 1);
                            likes = doc.data().like;
                            likes.push(emailUser);
                            evento.doc(obj.id).update({
                                like: likes
                            })
                        }
                        setCurti(doc.data().like.length);

                    }

                }
            })
        })

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
        var shares = [];
        evento.get().then(async (result) => {
            await result.docs.forEach(doc => {
                if (doc.id == obj.id) {
                    if (doc.data().share == '') {
                        evento.doc(obj.id).update({
                            share: emailUser
                        })
                    } else if (doc.data().share != '' && !Array.isArray(doc.data().share)) {
                        shares.push(doc.data().share);
                        shares.push(emailUser);
                        evento.doc(obj.id).update({
                            share: shares
                        })
                    } else {
                        shares = doc.data().share;
                        shares.push(emailUser);
                        evento.doc(obj.id).update({
                            share: shares
                        })
                    }
                    //  window.location.reload(false);
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
                            <BiLike />{curtir} curtidas</span> {props.id}
                    </div>
                </div>
                <hr />

                <div className="feedPost__util">
                    <div className="feedPost__reaction">

                        <BiLike />

                        <span onClick={() => funcGostei({ id: props.id })} className="">Gostei</span>


                    </div>

                    <div className="feedPost__reaction">
                        <CgComment />
                        <span onClick={() => comentarios({ id: props.id })} className="">comentar</span>
                    </div>

                    <div className="feedPost__reaction">
                        <FaShare />
                        <span onClick={() => funcCompartilhar({ id: props.id })} className="">Compartilhar</span>
                    </div>
                </div>
                {element}
            </div>
        </div>
    )
}