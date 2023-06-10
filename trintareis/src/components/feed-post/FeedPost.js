import './feedPost.css'
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactPlayer from 'react-player';
import { HiHeart, HiOutlineHeart, HiOutlineAnnotation, HiOutlineShare, HiOutlinePencilAlt, HiOutlineTrash, HiDotsVertical, HiOutlineArrowCircleLeft } from "react-icons/hi";
import * as AlertDialog from '@radix-ui/react-alert-dialog';

import api from '../../config/api';
import user from '../../resources/user.png';
import firebase from '../../config/firebase';
import NotyfContext from '../notyf-toast/NotyfContext';
import { isEmpty, isURL } from '../../helpers/helper';
import { homeRefreshContext as homeContext } from '../../view/home';
import { homeRefreshContext as profileContext } from '../../view/profile';
import { GoThreeBars } from "react-icons/go";


export default function (props) {

    const notyf = useContext(NotyfContext);
    const loggedUser = useSelector(state => state.emailUser);
    const date = new Date();

    const {homeRefresh, setHomeRefresh} = (props.origin === "home") ? useContext(homeContext) : useContext(profileContext);

    const [media, setMedia] = useState(<></>);
    const [like, setLike] = useState(0);
    const [likeStyle, setLikeStyle] = useState(<HiOutlineHeart />);
    const [curtiu, setCurtiu] = useState(0);
    const [curtir, setCurti] = useState('');
    const [totalComentario, setTotalComentario] = useState(0);
    const [userName, setUserName] = useState('');
    const [compartilhar, setCompartilhar] = useState('');
    const [compartilhou, setCompartilhou] = useState('');
    const [element, setElement] = useState('');
    const [todosComentarios, setTodosComentarios] = useState("");
    const [botaoGostei, setBotaoGostei] = useState('');
    const [clistaFotos, setListaFotos] = useState([]);
    const [profileData, setProfileData] = useState({});
    const [profilePhoto, setProfilePhoto] = useState(user);
    const [profileLink, setProfileLink] = useState("");
    const [postOptions, setPostOptions] = useState(<></>);
    const [update, setUpdate] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const [comment, setComment] = useState('');

    useEffect(() => {
        const abortController = new AbortController();

        setBotaoGostei(
            <div className='feed-content-bt-like'>
                {likeStyle}
                <span onClick={() => funcGostei({ id: props.id })} id={props.id + '_botao'}>Gostei {like} </span>
            </div>
        );

        if (!isEmpty(props.coments)) {
            setTotalComentario(props.coments.length)
            console.log(props.coments)
        }

        if (!isEmpty(props.profilePhoto)) {
            setProfilePhoto(props.profilePhoto)
        }

        //--------------- botão excluir ----------------------------------------------
        if (props.emailUser === loggedUser) {
            setPostOptions(
                <div className="options_div">
                    {/*<HiOutlinePencilAlt className="options_button"/>*/}
                    <AlertDialog.Root>
                        <AlertDialog.Trigger asChild>
                            <div className="options_button" >
                                <HiOutlineTrash />
                            </div>
                        </AlertDialog.Trigger>
                        <AlertDialog.Portal>
                            <AlertDialog.Overlay className="AlertDialogOverlay" />
                            <AlertDialog.Content className="AlertDialogContent">
                                <AlertDialog.Title className="AlertDialogTitle">Excluir</AlertDialog.Title>
                                <AlertDialog.Description className="AlertDialogDescription">
                                    Você quer mesmo excluir esta postagem?
                                </AlertDialog.Description>
                                <div style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }}>
                                    <AlertDialog.Cancel asChild>
                                        <button className="DialogButton mauve">Cancelar</button>
                                    </AlertDialog.Cancel>
                                    <AlertDialog.Action asChild>
                                        <button className="DialogButton red" onClick={deletePost}>Excluir</button>
                                    </AlertDialog.Action>
                                </div>
                            </AlertDialog.Content>
                        </AlertDialog.Portal>
                    </AlertDialog.Root>
                </div>
            )
        }

        //------------------------------------- post de midia ------------------------------------------------------
        switch (props.tipo) {

            case "POST_PHOTO":
                if (isURL(props.img)) {
                    setMedia(<img src={props.img} />)
                } else {
                    firebase.storage().ref(`images/${props.img}`).getDownloadURL().then(url => { setMedia(<img src={url} />) });
                }
                break;

            case "POST_VIDEO":
                let link = props.img
                setMedia(
                    <ReactPlayer
                        url={
                            link.includes("/watch?v=")
                                ? link.replace("/watch?v=", "/embed/")
                                : link
                        }
                        controls={true}
                        origin={window.location}
                        className='react-player'
                        config={{ youtube: { playerVars: { origin: 'https://www.youtube.com' } } }}
                        width={'100%'}
                        height={'500px'}
                    />
                );
                break;

            default:
                break;
        }

        //----------------------------------- like ----------------------------------
        if (!loaded) {
            if (!isEmpty(props.like)) {
                setLike(props.like)
            }

            api.get('/likes?postId=' + props.id)
                .then((response) => {

                response.data.map(item => {
                    if(item.userEmail == loggedUser){
                        setLikeStyle(<HiHeart color="red"/>)
                    }
                });
                setLoaded(true);
                setUpdate(!update);

            }).catch(function (error) {
                console.log(error);
                notyf.error("Desculpe, ocorreu um erro");
            })
        }

        return function cleanup() {
            abortController.abort()
        }
    }, [update]);


    function sendNotificationToast() {
        notyf.open({
            type: 'info',
            message: 'Em desenvolvimento'
        })
    }

    return (
        <div className="feedPost">
            <div className="feedPostSingle">
                <div className="feedPost__profile">
                    <div>
                        <Link to={{
                            pathname: ("/profile/" + props.profileId),
                            state: {
                                firstLogin: props.stateFirstLogin,
                                profilePhoto: props.stateProfilePhoto,
                                coverPhoto: props.stateCoverPhoto,
                                userData: props.stateUserData,
                                origin: ("post." + props.id)
                            }
                        }} style={{ textDecoration: 'none' }}>
                            <img src={profilePhoto} />
                        </Link>
                    </div>
                    <div className="div__info">
                        <Link to={{
                            pathname: ("/profile/" + props.profileId),
                            state: {
                                firstLogin: props.stateFirstLogin,
                                profilePhoto: props.stateProfilePhoto,
                                coverPhoto: props.stateCoverPhoto,
                                userData: props.stateUserData,
                                origin: ("post." + props.id)
                            }
                        }} style={{ textDecoration: 'none' }}>
                            <div>
                                <span>{props.nome}</span>
                            </div>
                        </Link>
                        <div>
                            <span>{props.horario}</span>
                        </div>
                    </div>
                    {postOptions}
                </div>
                <div className="feedPost__content">
                    <p>
                        {props.conteudo}<br />
                    </p>
                    <div className='media'>
                        {media}
                    </div>
                </div>
                <div className="div__info">
                    <div>
                    </div>
                </div>
                <hr />
                <div className="feedPost__util">
                    <div className="feedPost__reaction">
                        {botaoGostei}
                    </div>

                    <div className="feedPost__reaction">
                        <div className="feed-content-bt-like">
                            <HiOutlineAnnotation />
                            <span onClick={() => comentarios({ props: props }, { comentario: props.coments })}>Comentários {totalComentario}</span>
                        </div>
                    </div>

                    <div className="feedPost__reaction">
                        <div className="feed-content-bt-like">
                            <HiOutlineShare />
                            <span onClick={sendNotificationToast} className="">Compartilhar</span>
                        </div>
                    </div>
                </div>
                <div>
                    {element}
                    {todosComentarios}
                </div>
            </div>
        </div>
    )

    function deletePost() {
        api.delete('/content', {
            params: {
                id: props.id
            }
        })
        .then(() => {
            notyf.success("Sua postagem foi excluída");
        })
        .catch(function (error) {
            console.log(error);
            notyf.error("Desculpe, ocorreu um erro");
        })
        .finally(()=>{
            setHomeRefresh(!homeRefresh);
        })
    }

    function postLike(obj) {
        api.post('/likes', {
            postId: obj.id,
            userEmail: loggedUser
        })
            .then(() => {
                setLike(like + 1);
                setLikeStyle(<HiHeart color="red" />)
                setUpdate(!update)
            })
            .catch(function (error) {
                console.log(error);
                notyf.error("Desculpe, ocorreu um erro");
            })
    }

    function deletetLike(obj) {
        api.delete('/likes', {
            params: {
                userEmail: loggedUser,
                postId: obj.id
            }
        })
            .then(() => {
                (like > 1) ? setLike(like - 1) : setLike(0);
                setLikeStyle(<HiOutlineHeart />);
                setUpdate(!update)
            })
            .catch(function (error) {
                console.log(error);
                notyf.error("Desculpe, ocorreu um erro");
            })
    }

    function funcGostei(obj) {
        api.get('/likes/', { params: { postId: obj.id } })
            .then((response) => {
                let flag = false;

                response.data.map(item => {
                    if (item.userEmail == loggedUser) {
                        flag = true;
                    }
                });

                if (flag) {
                    deletetLike({ id: props.id });
                }

                if (!flag) {
                    postLike({ id: props.id });
                }
            }).catch(function (error) {
                console.log(error);
                notyf.error("Desculpe, ocorreu um erro");
            })
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

            console.log("props");
            console.log(props);
            console.log("props.comentario");
            console.log(props.comentario);

            // listItems2 = Array.prototype.forEach.call(props.comentario, number => {
            listItems2 = reordenar.map(
                (number) =>
                    <div>
                        <div className='div__comentario'>
                            <div className="div__foto feedPost__profile">
                                <img src={number.profilePhoto} />
                            </div>
                            <div className='feed-comentario-texto'>
                                <div className="div__comentario_metad_left">
                                    <div className="div__header_comment">
                                        <div><span>{number.userName}</span></div>
                                        <div><p>{number.profileInformation}</p></div>
                                    </div>
                                    <div className="div__SlOptions">
                                        <GoThreeBars />
                                    </div>
                                </div>
                                <div className='div__comment'>{number.text}</div>
                                {/* <div className='feed-data-modificada'>{calcularHoras(number.data, number.tipo_comentario)}</div> */}
                            </div>

                            {/* <div className='feed-comentario-metad-right'>
                                <a onClick={() => atualizarComentario({ json }, number.order, idEvento, 'true')} className="shadow-interpolacao-feed"><HiDotsVertical /></a>
                            </div> */}
                        </div>
                        <br />
                    </div>
            );
            setTodosComentarios(listItems2);
            setUpdate(!update);
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

    function salvarComentario(obj) {
        // obj.preventDefault();
        // let evento = firebase.firestore().collection('events');
        // var comentarios = [];
        // evento.get().then(async (result) => {
        //     await result.docs.forEach(doc => {
        //         if (doc.id == obj.target[1].value) {
        //             try {
        //                 if (doc.data().coments != "") {
        //                     comentarios = doc.data().coments;
        //                 }
        //                 comentarios.push({ data: date.getTime(), tipo_comentario: 'c', autor: userName, email: loggedUser, content: obj.target[0].value });
        //                 console.log('Comentario Criado: ' + obj.target[0].value);
        //                 evento.doc(obj.target[1].value).update({
        //                     coments: comentarios
        //                 })
        //                 document.getElementById(obj.target[1].value + '_texto').value = '';
        //                 setTotalComentario(comentarios.length);
        //             } catch (e) {
        //                 console.log('erro ao salvar comentario: ' + comentarios);
        //             }
        //             exibirComentario(comentarios, doc.id);
        //         }
        //     });
        // });
    }

    function apagarComentario(lista, posiaco, idEvento) {
        // let evento = firebase.firestore().collection('events');
        // var comentarios = [];
        // console.log('lista 1: ' + lista)
        // let reordenar = [];
        // var i = lista.length;
        // lista.forEach(function (coment) {
        //     if (posiaco != i) {
        //         reordenar.unshift(coment);
        //     }
        //     coment.order = i--;
        // })

        // let ordenar = [];
        // reordenar.forEach(function (coment) {
        //     ordenar.unshift(coment)
        // })
        // setTotalComentario(reordenar.length);
        // evento.get().then(async (result) => {
        //     await result.docs.forEach(doc => {
        //         if (doc.id == idEvento) {
        //             try {
        //                 evento.doc(idEvento).update({
        //                     coments: ordenar
        //                 })
        //             } catch (e) {
        //                 console.log('erro ao salvar comentario');
        //             }
        //             exibirComentario(ordenar, doc.id);
        //         }
        //     });
        // });
    }

    function editarComentario(obj) {
        // obj.preventDefault();
        // let evento = firebase.firestore().collection('events');
        // var comentarios = [];

        // let lista = obj.target[3].value;
        // lista = JSON.parse(lista);

        // let reordenar = [];
        // var i = lista.length;
        // lista.forEach(function (coment) {
        //     if (i == obj.target[1].value) {
        //         reordenar.unshift({ id: i, data: date.getTime(), tipo_comentario: 'e', autor: userName, email: loggedUser, content: obj.target[0].value });
        //         console.log('Comentario Editado: ' + obj.target[0].value);
        //     } else {
        //         reordenar.unshift(coment);
        //     }
        //     coment.order = i--;
        // })

        // let ordenar = [];
        // reordenar.forEach(function (coment) {
        //     ordenar.unshift(coment)
        // })


        // console.log('reordenar: ultimo comentario primeiro');
        // console.log(reordenar);
        // console.log(ordenar);


        // evento.get().then(async (result) => {
        //     await result.docs.forEach(doc => {
        //         if (doc.id == obj.target[2].value) {
        //             try {
        //                 evento.doc(obj.target[2].value).update({
        //                     coments: ordenar
        //                 })
        //             } catch (e) {
        //                 console.log('erro ao salvar comentario: ' + comentarios);
        //             }
        //             exibirComentario(ordenar, doc.id);
        //         }
        //     });
        // });
    }

    function comentarios(obj, comentarios) {
        if (comentarios != null) {
            exibirComentario(comentarios, obj.id);
        }

        setElement(
            <div className="feedPost__profile">
                <div className="div__coment_main">
                    <div>
                        <Link to={{
                            pathname: ("/profile/" + props.profileId),
                            state: {
                                firstLogin: props.stateFirstLogin,
                                profilePhoto: props.stateProfilePhoto,
                                coverPhoto: props.stateCoverPhoto,
                                userData: props.stateUserData,
                                origin: ("post." + props.id)
                            }
                        }} style={{ textDecoration: 'none' }}>
                            <img src={profilePhoto} />
                        </Link>
                    </div>
                    <div className="div__button">
                        <input id="comment" type='text' placeholder="Adicione um comentário..." />
                    </div>
                    <div className='save_button'>
                        <button onClick={() => saveComment({ props: props })} type="submit">salvar</button>
                    </div>
                </div>
            </div>
        );
    }

    function saveComment(obj) {
        let text = document.getElementById("comment").value;

        api.post('/comment', {
            "postId": obj.props.id,
            "text": text,
            "userEmail": loggedUser
        })
        .then(function (response) {
            if (response.status === 201) {
                notyf.success("Comentário criado com sucesso!");
                document.getElementById("comment").value = '';
            }
        })
        .catch(function (error) {
            console.log(error.status)
            notyf.error("Ocorreu um erro, favor tente novamente");
        })
        .finally(()=>{
            setHomeRefresh(!homeRefresh);
        })
        
    }

    function limparComentario(obj) {
        alert('limpou comentario.');


        let evento = firebase.firestore().collection('events');
        evento.doc(obj.id).update({
            coments: ''
        })
        return false;
    }

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
}
