import './feedPost.css'
import React, { useState, useEffect, useContext } from 'react';
import { HiHeart, HiOutlineHeart, HiOutlineAnnotation, HiOutlineShare, HiOutlinePencilAlt, HiOutlineTrash, HiDotsVertical, HiOutlineArrowCircleLeft } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../config/api';
import firebase from '../../config/firebase';
import NotyfContext from '../notyf-toast/NotyfContext';
import user from '../../resources/user.png';
import loading from '../../resources/loading.gif';

export default function (props) {

    const notyf = useContext(NotyfContext);
    const loggedUser = useSelector(state => state.emailUser);
    const date = new Date();

    const [urlImages, setUrlImages] = useState('');
    const [curtir, setCurti] = useState('');
    const [curtiu, setCurtiu] = useState('');
    const [totalComentario, setTotalComentario] = useState('');
    const [userName, setUserName] = useState('');
    const [compartilhar, setCompartilhar] = useState('');
    const [compartilhou, setCompartilhou] = useState('');
    const [element, setElement] = useState('');
    const [todosComentarios, setTodosComentarios] = useState('');
    const [botaoGostei, setBotaoGostei] = useState('');
    const [clistaFotos, setListaFotos] = useState([]);

    firebase.firestore().collection('profiles').get().then(async (result) => {
        await result.docs.forEach(doc => {
            if (doc.data().emailUser == loggedUser) {
                setUserName(doc.data().userName);
            }
        })
    })

    function calcularHoras(tempo, tipo) {
        var date1 = new Date(tempo);
        var date2 = new Date();
        var diffDays = 0;
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffHour = Math.ceil(timeDiff / (1000 * 3600));
        var texto = '';
        if (tipo == 'c') {
            texto = 'Há ';
        } else if (tipo == 'e') {
            texto = 'Modificado há ';
        } else {
            texto = 'Há ';
        }
        if (diffHour <= 1) {
            var diffminutes = Math.ceil(timeDiff / (1000 * 60));
            return diffminutes + " minuto(s)";
        }
        if (diffHour > 1 && diffHour < 24) {
            return diffHour + " horas(s)";
        }
        if (diffHour > 24) {
            diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return texto + diffDays + " dias(s)";
        }

        return diffDays + "horas";
    }



    function exibirComentario(props, idEvento) {
        let listItems2 = [];
        var coment = "";
        if (props.comentario) {
            coment = props.comentario;
        } else {
            coment = props;
        }
        if (coment != "") {
            if (typeof coment === 'object') {
                coment = JSON.stringify(coment);
            }

            var json = '[' + coment.replace('[object Object],', '') + ']';
            json = json.replace('undefined,', '');
            json = json.replace('[object Object]', '');
            json = json.replace('[[', '[');
            json = json.replace(']]', ']');
            json = JSON.parse(json);

            let reordenar = [];
            var i = json.length;
            json.forEach(function (coment) {
                coment.order = i--;
                reordenar.unshift(coment)
            })

            console.log(reordenar);

            let posicao = 0;
            listItems2 = reordenar.map(
                (number) =>
                    <div>
                        <div className='feed-comentario-top'>
                            <div className='div__foto feedPost__profile '>
                                <img src="https://firebasestorage.googleapis.com/v0/b/trintareis-23e4c.appspot.com/o/profile_images%2Ftumblr_lq5hiexyPo1qmr4xc.bmp?alt=media&amp;token=d4bbdbd8-f761-4bba-8cab-9daa103aebbe" />
                            </div>
                            <div className='feed-comentario-texto'>
                                <div className='feed-comentario-metad-left'><h5>{number.autor}</h5></div>
                                <div className='feed-content'>{number.content}</div>
                                <div className='feed-data-modificada'>{calcularHoras(number.data, number.tipo_comentario)}</div>
                            </div>

                            <div className='feed-comentario-metad-right'>
                                <a onClick={() => atualizarComentario({ json }, number.order, idEvento, 'true')} className="shadow-interpolacao-feed"><HiDotsVertical /></a>
                            </div>
                        </div>
                        <br />
                    </div>
            );
            setTodosComentarios(listItems2);
        }
    }

    function atualizarComentario(props, pos, idEvento, botao) {
        console.log(pos);
        let listItems2 = [];
        let lista = [];
        if (props) {
            if (Array.isArray(props.json)) {
                lista = props.json;
            } else {
                lista = props.lista;
            }

            let reordenar = [];
            var i = lista.length;
            lista.forEach(function (coment) {
                coment.order = i--;
                reordenar.unshift(coment)
            })

            var comentario = lista;
            listItems2 = reordenar.map(
                (number) =>
                    <div>
                        {(number.order == pos) ?
                            (botao == 'true') ?
                                <div>

                                    {console.log('number.order A: ' + number.order + ' botao:' + botao + ' pos:' + pos)}

                                    <div className='feed-comentario-top'>
                                        <div className='div__foto feedPost__profile '>
                                            <img src="https://firebasestorage.googleapis.com/v0/b/trintareis-23e4c.appspot.com/o/profile_images%2Ftumblr_lq5hiexyPo1qmr4xc.bmp?alt=media&amp;token=d4bbdbd8-f761-4bba-8cab-9daa103aebbe" />
                                        </div>
                                        <div className='feed-comentario-texto'>
                                            <div className='feed-comentario-metad-left'><h5>{number.autor}</h5></div>
                                            <div className='feed-content'>{number.content}</div>
                                            <div className='feed-data-modificada'>{calcularHoras(number.data, number.tipo_comentario)}</div>
                                        </div>

                                        <div className='feed-comentario-metad-right'>
                                            <a onClick={() => atualizarComentario({ lista }, number.order, idEvento)} className="shadow-interpolacao-feed"><HiOutlinePencilAlt /></a>
                                            <Link to={`#`} onClick={() => { if (window.confirm('Deseja apagar o comentário?')) { apagarComentario(lista, number.order, idEvento) }; }} className="shadow-interpolacao-feed"> <HiOutlineTrash /></Link>
                                            <a onClick={() => exibirComentario({ comentario }, number.oder)} className="shadow-interpolacao-feed"><HiOutlineArrowCircleLeft /></a>
                                        </div>
                                    </div>
                                    <br />
                                </div>
                                :
                                <div>
                                    <div className='feed-comentario-top'>
                                        <div className='div__foto feedPost__profile '>
                                            <img src="https://firebasestorage.googleapis.com/v0/b/trintareis-23e4c.appspot.com/o/profile_images%2Ftumblr_lq5hiexyPo1qmr4xc.bmp?alt=media&amp;token=d4bbdbd8-f761-4bba-8cab-9daa103aebbe" />
                                        </div>
                                        <div className='feed-comentario-texto'>
                                            <div className='feed-comentario-metad-left'><h5>{number.autor}</h5></div>
                                            <form onSubmit={editarComentario}>
                                                <div>
                                                    <div className='feedPost__util feed__coments'>
                                                        <input type="textComent" defaultValue={number.content} className="form-control my-2" placeholder="Comentário" />
                                                        <input type="hidden" defaultValue={pos} />
                                                        <input type="hidden" defaultValue={idEvento} />
                                                        <input type="hidden" defaultValue={JSON.stringify(lista)} />
                                                        <input type="submit" Value="Editar" className="w-10 btn btn-coments fw-bold bor" />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <br />
                                </div>
                            :
                            <div>
                                <div className='feed-comentario-top'>
                                    <div className='div__foto feedPost__profile '>
                                        <img src="https://firebasestorage.googleapis.com/v0/b/trintareis-23e4c.appspot.com/o/profile_images%2Ftumblr_lq5hiexyPo1qmr4xc.bmp?alt=media&amp;token=d4bbdbd8-f761-4bba-8cab-9daa103aebbe" />
                                    </div>
                                    <div className='feed-comentario-texto'>
                                        <div className='feed-comentario-metad-left'><h5>{number.autor}</h5></div>
                                        <div className='feed-content'>{number.content}</div>
                                        <div className='feed-data-modificada'>{calcularHoras(number.data, number.tipo_comentario)}</div>
                                    </div>
                                    <div className='feed-comentario-metad-right'></div>
                                </div>
                                <br />
                            </div>
                        }
                    </div>
            );
            setTodosComentarios(listItems2);
        }
    }

    useEffect(() => {
        const abortController = new AbortController();
        setBotaoGostei(<div className='feed-content-bt-gostei'>
            <HiHeart />
            <span onClick={() => funcGostei({ id: props.id })} id={props.id + '_botao'} className="">Gostei</span>
        </div>);
        firebase.storage().ref(`images/${props.img}`).getDownloadURL().then(url => setUrlImages(url));
        if (Array.isArray(props.like) && props.like.length > 0) {
            setCurti(props.like.length);
            setTotalComentario(props.coments.length);
            
            props.like.forEach(function (like) {
                if (like == loggedUser) {
                    setCurtiu(1);
                    setBotaoGostei(<div className='feed-content-bt-gostei'>
                        <HiHeart style={{ color: 'cornflowerblue' }} />
                        <div onClick={() => funcDesgostei({ id: props.id })} id={props.id + '_botao'} className="feed-comentario-gostei">Gostei</div>
                    </div>);
                }
            })
        } else {
            setCurti(1);
            setCurtiu(0);
        }
        if (Array.isArray(props.share) && props.share.length > 0) {
            setCompartilhar(props.share.length);
            props.share.forEach(function (share) {
                if (share == loggedUser) {
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

    function salvarComentario(obj) {
        obj.preventDefault();
        let evento = firebase.firestore().collection('events');
        var comentarios = [];
        evento.get().then(async (result) => {
            await result.docs.forEach(doc => {
                if (doc.id == obj.target[1].value) {
                    try {
                        if (doc.data().coments != "") {
                            comentarios = doc.data().coments;
                        }
                        comentarios.push({ data: date.getTime(), tipo_comentario: 'c', autor: userName, email: loggedUser, content: obj.target[0].value });
                        console.log('Comentario Criado: ' + obj.target[0].value);
                        evento.doc(obj.target[1].value).update({
                            coments: comentarios
                        })
                        document.getElementById(obj.target[1].value + '_texto').value = '';
                        setTotalComentario(comentarios.length);
                    } catch (e) {
                        console.log('erro ao salvar comentario: ' + comentarios);
                    }
                    exibirComentario(comentarios, doc.id);
                }
            });
        });
    }
    function apagarComentario(lista, posiaco, idEvento) {
        let evento = firebase.firestore().collection('events');
        var comentarios = [];
        console.log('lista 1: ' + lista)
        let reordenar = [];
        var i = lista.length;
        lista.forEach(function (coment) {
            if (posiaco != i) {
                reordenar.unshift(coment);
            }
            coment.order = i--;
        })

        let ordenar = [];
        reordenar.forEach(function (coment) {
            ordenar.unshift(coment)
        })
        setTotalComentario(reordenar.length);
        evento.get().then(async (result) => {
            await result.docs.forEach(doc => {
                if (doc.id == idEvento) {
                    try {
                        evento.doc(idEvento).update({
                            coments: ordenar
                        })
                    } catch (e) {
                        console.log('erro ao salvar comentario');
                    }
                    exibirComentario(ordenar, doc.id);
                }
            });
        });
    }

    function editarComentario(obj) {
        obj.preventDefault();
        let evento = firebase.firestore().collection('events');
        var comentarios = [];

        let lista = obj.target[3].value;
        lista = JSON.parse(lista);

        let reordenar = [];
        var i = lista.length;
        lista.forEach(function (coment) {
            if (i == obj.target[1].value) {
                reordenar.unshift({ id: i, data: date.getTime(), tipo_comentario: 'e', autor: userName, email: loggedUser, content: obj.target[0].value });
                console.log('Comentario Editado: ' + obj.target[0].value);
            } else {
                reordenar.unshift(coment);
            }
            coment.order = i--;
        })

        let ordenar = [];
        reordenar.forEach(function (coment) {
            ordenar.unshift(coment)
        })


        console.log('reordenar: ultimo comentario primeiro');
        console.log(reordenar);
        console.log(ordenar);


        evento.get().then(async (result) => {
            await result.docs.forEach(doc => {
                if (doc.id == obj.target[2].value) {
                    try {
                        evento.doc(obj.target[2].value).update({
                            coments: ordenar
                        })
                    } catch (e) {
                        console.log('erro ao salvar comentario: ' + comentarios);
                    }
                    exibirComentario(ordenar, doc.id);
                }
            });
        });
    }

    function comentarios(obj, comentarios) {

        let listaFoto = [];
        firebase.firestore().collection('profiles').get().then(async (result) => {
            await result.docs.forEach(doc => {
                listaFoto.push({ email: doc.data().emailUser, foto: doc.data().profilePhoto });
            })
        })
        setListaFotos(<div>listaFoto</div>);
        if (comentarios.comentario != null) {
            exibirComentario(comentarios, obj.id);
        }
        setElement(
            <form onSubmit={salvarComentario}>
                <div>
                    <h5>Comentários</h5>
                    <div className='feedPost__util feed__coments'>
                        <input type="textComent" className="form-control my-2" defaultValue="" id={obj.id + '_texto'} placeholder="Comentário" />
                        <input type="hidden" value={obj.id} />
                        <input type="submit" value="Salvar" className="w-10 btn btn-coments fw-bold bor" />
                    </div>
                </div>
            </form>
        );
    }

    function limparComentario(obj) {
        alert('limpou comentario.');


        let evento = firebase.firestore().collection('events');
        evento.doc(obj.id).update({
            coments: ''
        })
        return false;
    }

    function limparGostei(obj) {
        alert('limpou curtidas.');

        setCurti(curtir - 1);
        let evento = firebase.firestore().collection('events');
        evento.doc(obj.id).update({
            like: 'dfasdf@adfasdf'
        })
        return false;
    }

    function funcDesgostei(obj) {
        setBotaoGostei(<div className='feed-content-bt-gostei'>
            <HiOutlineHeart />
            <div onClick={() => funcGostei({ id: props.id })} id={props.id + '_botao'} className="">Gostei</div>
        </div>);

        let evento = firebase.firestore().collection('events');
        var likes = [];
        evento.get().then(async (result) => {
            await result.docs.forEach(doc => {

                if (doc.id == obj.id) {
                    console.log(doc.data().like);
                    doc.data().like.forEach(function (like) {
                        if (like == loggedUser) {
                            retorno = false;
                        } else {
                            likes.push(like)
                        }
                    })
                    setCurti(parseInt(likes.length))
                    if (likes != "") {
                        evento.doc(obj.id).update({
                            like: likes
                        })
                    }

                    console.log(likes);
                    console.log('aaaaaaaaaaaa');

                    var retorno = true;

                }
            })
        })
    }

    function funcGostei(obj) {
        setBotaoGostei(<div>
            <HiHeart style={{ color: 'cornflowerblue' }} />
            <span onClick={() => funcDesgostei({ id: props.id })} id={props.id + '_botao'} className="feed-comentario-gostei">Gostei</span>
        </div>);

        let evento = firebase.firestore().collection('events');
        var likes = [];
        evento.get().then(async (result) => {
            await result.docs.forEach(doc => {
                if (doc.id == obj.id) {
                    var retorno = true;
                    if (Array.isArray(doc.data().like)) {
                        doc.data().like.forEach(function (like) {
                            if (like == loggedUser) {
                                retorno = false;
                            }
                        })
                    } else {
                        if (doc.data().like == loggedUser) {
                            retorno = false;
                        }
                    }
                    if (retorno) {
                        if (doc.data().like == '') {
                            evento.doc(obj.id).update({
                                like: loggedUser
                            })
                        } else if (doc.data().like != '' && !Array.isArray(doc.data().like)) {
                            likes.push(doc.data().like);
                            likes.push(loggedUser);
                            evento.doc(obj.id).update({
                                like: likes
                            })
                        } else {
                            likes = doc.data().like;
                            likes.push(loggedUser);
                            evento.doc(obj.id).update({
                                like: likes
                            })
                        }
                        setCurti(parseInt(likes.length));

                    }
                }
            })
        })


    }


    function funcCompartilhar(obj) {
        notyf.open({
            type: 'info',
            message: 'Em desenvolvimento'
          });
        /*
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
        })*/
    }






    return (
        <div className="feedPost">
            <div className="feedPostSingle">
                <div className="feedPost__profile">
                    <div>

                        <Link to={props.emailUser === loggedUser ? `/profile` : `/profile/${props.profileId}`}>
                            <img src={props.profilePhoto} />
                        </Link>
                    </div>
                    <div className="div__info">
                        <Link to={props.emailUser === loggedUser ? `/profile` : `/profile/${props.profileId}`}>
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
                        {botaoGostei}({curtir})
                    </div>

                    <div className="feedPost__reaction">
                        <HiOutlineAnnotation />
                        <span onClick={() => comentarios({ id: props.id }, { comentario: props.coments })} className="">comentar ({totalComentario})</span>
                    </div>

                    <div className="feedPost__reaction">
                        <HiOutlineShare />
                        <span onClick={() => funcCompartilhar({ id: props.id })} className="">Compartilhar</span>
                    </div>
                </div>
                <div>
                    {element}
                    {todosComentarios}
                </div>
            </div>
        </div>
    )
}
