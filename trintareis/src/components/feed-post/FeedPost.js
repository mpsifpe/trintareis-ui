import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
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
    const loggedUSer = useSelector(state => state.loggedUSer);
    const [curtir, setCurti] = useState('');
    const [curtiu, setCurtiu] = useState('');
    const [userName, setUserName] = useState('');
    const date = new Date();
    const [compartilhar, setCompartilhar] = useState('');
    const [compartilhou, setCompartilhou] = useState('');
    const [element, setElement] = useState('');
    const [todosComentarios, setTodosComentarios] = useState('');

    firebase.firestore().collection('profiles').get().then(async (result) => {
        await result.docs.forEach(doc => {
            if (doc.data().emailUser == emailUser) {
                setUserName(doc.data().userName);
            }
        })
    })

    function exibirComentario(props, idEvento) {
        let listItems2 = [];
        var coment = "";
        if (props.comentario) {
            coment = props.comentario;
        } else {
            coment = props;
        }
        if (coment) {
            if (typeof coment === 'object') {
                coment = JSON.stringify(coment);
            }

            var json = '[' + coment.replace('[object Object],', '') + ']';
            json = json.replace('undefined,', '');
            json = json.replace('[object Object]', '');
            json = json.replace('[[', '[');
            json = json.replace(']]', ']');
            json = JSON.parse(json);
            console.log(json);
            var posicao = 0;
            listItems2 = json.map(
                (number) =>
                    <div>
                        <div className='feed-comentario-top'>
                            <div className='feed-comentario-metad-left'><h5>{number.autor}</h5></div>
                            <div className='feed-comentario-metad-right'>
                                <a onClick={() => atualizarComentario({ json }, number.id, idEvento, 'true')} className="shadow-interpolacao-feed"><BsThreeDots /></a>
                            </div>
                        </div>
                        <span>{number.content}</span>
                        <br />
                    </div>
            );
            setTodosComentarios(listItems2);
        }
    }

    function atualizarComentario(props, posicao, idEvento, botao) {
        let listItems2 = [];
        let lista = [];
        if (props) {
            if (Array.isArray(props.json)) {
                lista = props.json;
            } else {
                lista = props.lista;
            }
            var pos = posicao;
            var posicao = 0;
            listItems2 = lista.map(
                (number) =>
                    <div>
                        <div className='dv-ocult'>{posicao = posicao + 1}
                            {console.log(posicao)} - {console.log(pos)}
                        </div>
                        {(posicao == pos) ?

                            (botao == 'true') ?

                                <div>
                                    <div className='feed-comentario-top'>
                                        <div className='feed-comentario-metad-left'><h5>{number.autor}</h5></div>
                                        <div className='feed-comentario-metad-right'>
                                            <a onClick={() => atualizarComentario({ lista }, number.id, idEvento)} className="shadow-interpolacao-feed"><FaPencilAlt /></a>
                                            <Link to={`#`} onClick={() => { if (window.confirm('Deseja apagar o comentário?')) { apagarComentario(number.id, idEvento) }; }} className="shadow-interpolacao-feed"> <FaTrashAlt /></Link>
                                        </div>
                                    </div>
                                    <span>{number.content}</span>
                                </div>
                                :
                                <div>
                                    <h5>{number.autor}</h5>
                                    <form onSubmit={editarComentario}>
                                        <div>
                                            <div className='feedPost__util feed__coments'>
                                                <input type="textComent" defaultValue={number.content} className="form-control my-2" placeholder="Comentário" />
                                                <input type="hidden" defaultValue={pos} />
                                                <input type="hidden" defaultValue={idEvento} />
                                                <input type="submit" Value="Editar" className="w-10 btn btn-coments fw-bold bor" />
                                            </div>
                                        </div>
                                    </form>
                                </div>


                            :
                            <div>
                                <h5>{number.autor}</h5>
                                <span>{number.content}</span>
                                <a onClick={() => atualizarComentario({ lista }, number.id, idEvento, 'true')} className="shadow-interpolacao-feed"><BsThreeDots /></a>
                            </div>
                        }
                    </div>
            );
            setTodosComentarios(listItems2);
        }
    }

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
        return function cleanup() {
            abortController.abort()
        }
    }, []);

    function carregarEditar(obj, lista) {
        console.log(lista);
        alert('editar ');
    }

    function limparComentario(obj) {
        let evento = firebase.firestore().collection('events');
        alert('vc limpou o conteudo');
        evento.doc(obj.id).update({
            coments: null
        })
        return false;
    }

    function salvarComentario(obj) {
        obj.preventDefault();
        let evento = firebase.firestore().collection('events');
        var comentarios = "";
        evento.get().then(async (result) => {
            await result.docs.forEach(doc => {
                if (doc.id == obj.target[1].value) {
                    try {
                        if (doc.data().coments == '' || doc.data().coments == null) {
                            comentarios = { id: 1, data: date.getDate(), autor: userName, content: obj.target[0].value };
                            comentarios = JSON.stringify(comentarios);
                            evento.doc(obj.target[1].value).update({
                                coments: comentarios
                            })
                        } else {
                            comentarios = doc.data().coments;
                            comentarios = comentarios.replace('undefined,', '');
                            comentarios = '[' + comentarios.replace('[object Object],', '') + ']';
                            comentarios = comentarios.replace('[object Object]', '');
                            comentarios = comentarios.replace('[[', '[');
                            comentarios = comentarios.replace(']]', ']');
                            var quantidade = JSON.parse(comentarios);
                            comentarios = comentarios.replace(']', ',');
                            comentarios += JSON.stringify({ id: quantidade.length + 1, data: date.getDate(), autor: userName, content: obj.target[0].value });
                            comentarios += ']';
                            evento.doc(obj.target[1].value).update({
                                coments: comentarios
                            })
                        }
                    } catch (e) {
                        console.log('erro ao salvar comentario: ' + comentarios);
                    }
                    exibirComentario(comentarios, doc.id);
                }
            });
        });
    }
    function apagarComentario(posiaco, idEvento) {
        let evento = firebase.firestore().collection('events');
        var comentarios = [];
        evento.get().then(async (result) => {
            await result.docs.forEach(doc => {
                if (doc.id == idEvento) {
                    try {
                        if (JSON.parse(doc.data().coments).length == 1) {
                            evento.doc(idEvento).update({
                                coments: ''
                            })
                        } else {
                            let texto = JSON.parse(doc.data().coments);
                            texto.forEach(function (coment) {
                                if (coment.id == posiaco) {

                                } else {
                                    comentarios.push(coment);
                                }
                            })
                            evento.doc(idEvento).update({
                                coments: JSON.stringify(comentarios)
                            })
                        }
                    } catch (e) {
                        console.log('erro ao salvar comentario: ' + comentarios);
                    }
                    exibirComentario(comentarios, doc.id);
                }
            });
        });
    }

    function editarComentario(obj) {
        obj.preventDefault();
        let evento = firebase.firestore().collection('events');
        var comentarios = [];
        evento.get().then(async (result) => {
            await result.docs.forEach(doc => {
                if (doc.id == obj.target[2].value) {
                    try {
                        if (JSON.parse(doc.data().coments).length == 1) {
                            comentarios = { id: 1, data: date.getTime(), autor: userName, content: obj.target[0].value };
                            comentarios = JSON.stringify(comentarios);
                            evento.doc(obj.target[1].value).update({
                                coments: comentarios
                            })
                        } else {
                            let texto = JSON.parse(doc.data().coments);
                            texto.forEach(function (coment) {
                                if (coment.id == obj.target[1].value) {
                                    comentarios.push({ id: coment.id, data: coment.data, autor: coment.autor, content: obj.target[0].value });
                                } else {
                                    comentarios.push(coment);
                                }
                            })
                            evento.doc(obj.target[2].value).update({
                                coments: JSON.stringify(comentarios)
                            })
                        }
                    } catch (e) {
                        console.log('erro ao salvar comentario: ' + comentarios);
                    }
                    exibirComentario(comentarios, doc.id);
                }
            });
        });
    }

    function comentarios(obj, comentarios) {
        if (comentarios.comentario != null) {
            exibirComentario(comentarios, obj.id);
        }
        setElement(
            <form onSubmit={salvarComentario}>
                <div> <span onClick={() => limparComentario({ id: obj.id })} className="">limpar</span>{props.id}</div>
                <div>
                    <h5>Comentários</h5>
                    <div className='feedPost__util feed__coments'>
                        <input type="textComent" className="form-control my-2" placeholder="Comentário" />
                        <input type="hidden" value={obj.id} />
                        <input type="submit" value="Salvar" className="w-10 btn btn-coments fw-bold bor" />
                    </div>
                </div>
            </form>
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
                        <span onClick={() => funcGostei({ id: props.id })} className="">Gostei</span>
                    </div>

                    <div className="feedPost__reaction">
                        <CgComment />
                        <span onClick={() => comentarios({ id: props.id }, { comentario: props.coments })} className="">comentar</span>
                    </div>

                    <div className="feedPost__reaction">
                        <FaShare />
                        <span onClick={() => funcCompartilhar({ id: props.id })} className="">Compartilhar</span>
                    </div>
                </div>
                <div className='p-3'>
                    {element}
                    {todosComentarios}
                </div>
            </div>
        </div>
    )
}