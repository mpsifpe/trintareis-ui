import './profile.css';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { MdDone, MdClose } from "react-icons/md";
import { Perfil, Content, Details, Dropdown } from './styles';

import { isEmpty, formatDate } from '../../helpers/helper';
import Header from '../../components/header/index';
import FeedForm from '../../components/feed-form/index';
import TimeLine from '../../components/timeline_profile/index';
import loading from '../../resources/loading.gif';
import user from '../../resources/user.png';
import cover from '../../resources/cover.png';
import firebase from '../../config/firebase';
import NotyfContext from '../../components/notyf-toast/NotyfContext';
import api from '../../config/api';
import { GiConsoleController } from 'react-icons/gi';

import DropdownProfile from '../../components/dropdown-profile';


function Profile(props) {

    const emailUser = useSelector(state => state.emailUser);
    //const storage = firebase.storage();
    const events = firebase.firestore().collection('events');
    const notyf = useContext(NotyfContext);

    const [eventos, setEventos] = useState([]);
    const [urlImageProfile, setUrlImageProfile] = useState(loading);
    const [urlImageCover, seturlImageCover] = useState(cover);
    const [userName, setUserName] = useState("");
    const [profileInformation, setProfileInformation] = useState("");
    const [city, setCity] = useState("");
    const [region, setRegion] = useState("");
    const [details, setDetails] = useState("");
    const [actionButton, setActionButton] = useState(<></>);

    let profileEmail, idConnection = "";
    let isFriend, inviter, pending = false;
    let location = useLocation();
    let listEventos = [];
    let params = useParams();

    useEffect(() => {
        const abortController = new AbortController()

        async function fetch() {

            if (params.id === location.state.userData.id) {

                setUserName(location.state.userData.userName)
                setProfileInformation(location.state.userData.profileInformation)
                setCity(location.state.userData.city)
                setRegion(location.state.userData.region)
                setDetails(location.state.userData.details)
                profileEmail = emailUser

                if (!isEmpty(location.state.profilePhoto)) {
                    storage.ref("profile_images/" + location.state.profilePhoto).getDownloadURL()
                        .then(url => setUrlImageProfile(url))
                }
                else { setUrlImageProfile(user) }

                if (!isEmpty(location.state.coverPhoto)) {
                    storage.ref("profile_images/" + location.state.coverPhoto).getDownloadURL()
                        .then(url => seturlImageCover(url))
                }

                setActionButton(<Link to={{ pathname: '/editProfile', state: location.state }} style={{ textDecoration: 'none' }}>
                    <label className='action_button'>Editar</label>
                </Link>)

                events.where('emailUser', '==', emailUser).orderBy("dataTime", "desc").get().then((events) => {
                    events.forEach((event) => {
                        const date = new Date(event.data().dataTime);
                        listEventos.push({
                            id: event.id,
                            timePublication: date.getHours() + ':' + date.getMinutes(),
                            ...event.data()
                        })
                    })
                });
            }
            else {
                api.get('/profile/get-by-id/' + params.id)
                    .then((response) => {
                        setUserName(response.data.userName)
                        setProfileInformation(response.data.profileInformation)
                        setDetails(response.data.details)
                        setRegion(response.data.region)
                        setCity(response.data.city)
                        profileEmail = response.data.emailUser

                        if (!isEmpty(response.data.profilePhoto)) {
                            storage.ref("profile_images/" + response.data.profilePhoto).getDownloadURL()
                                .then(url => setUrlImageProfile(url))
                        }
                        else { setUrlImageProfile(user) }

                        if (!isEmpty(response.data.coverPhoto)) {
                            storage.ref("profile_images/" + response.data.coverPhoto).getDownloadURL()
                                .then(url => seturlImageCover(url))
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                        notyf.error("Desculpe, ocorreu um erro")
                    })
                    .then(() => {
                        setActionButton(<label className='action_button' onClick={actionButtonClick}>Conectar</label>)
                        api.get('/friends/', {
                            params: {
                                userEmail: emailUser,
                                page: 0,
                                size: 100
                            }
                        })
                            .then(function (response) {
                                for (let i = 0; i < response.data.content.length; i++) {
                                    if (response.data.content[i].id === params.id) {
                                        idConnection = response.data.content[i].idConnection;
                                        profileEmail = response.data.content[i].userEmail;
                                        inviter = response.data.content[i].inviter;
                                        isFriend = true;

                                        if (response.data.content[i].pending) {
                                            pending = true;
                                            if (response.data.content[i].inviter) {
                                                setActionButton(<label className='action_button' onClick={actionButtonClick}>Convidado</label>);
                                            } else { setActionButton(<label className='action_button' onClick={actionButtonClick}>Aceitar</label>); }
                                        }
                                        else {
                                            setActionButton(<label className='action_button' onClick={actionButtonClick}>Desconectar</label>);
                                        }
                                    }
                                }
                            })
                            .catch((error) => { console.log(error) })

                        events.where('emailUser', '==', profileEmail).orderBy("dataTime", "desc").get().then((events) => {
                            events.forEach((event) => {
                                const date = new Date(event.data().dataTime);
                                listEventos.push({
                                    id: event.id,
                                    timePublication: date.getHours() + ':' + date.getMinutes(),
                                    ...event.data()
                                })
                            })
                        })
                    })

            }
        }

        fetch().then(() => {
            setEventos(listEventos);
        })

        return function cleanup() {
            abortController.abort()
        }
    }, []);

    function actionButtonClick() {
        if (isFriend) {
            if (pending) {
                if (inviter) {
                    api.delete('/friends', {
                        params: {
                            idConnection: idConnection
                        }
                    })
                        .then(() => {
                            notyf.success("Conexão desfeita");
                            setActionButton(<label className='action_button'><MdClose /></label>);
                        })
                        .catch((error) => {
                            console.log(error)
                            notyf.error("Desculpe, ocorreu um erro");
                            setActionButton(<></>);
                        })
                }
                else {
                    api.put('/friends?id=' + idConnection)
                        .then(() => {
                            notyf.success("Convite aceito");
                            setActionButton(<label className='action_button'><MdDone /></label>);
                        })
                        .catch((error) => {
                            console.log(error)
                            notyf.error("Desculpe, ocorreu um erro");
                            setActionButton(<></>);
                        })
                }
            }
            else {
                api.delete('/friends', {
                    params: {
                        idConnection: idConnection
                    }
                })
                    .then(() => {
                        notyf.success("Conexão desfeita");
                        setActionButton(<label className='action_button'><MdClose /></label>);
                    })
                    .catch((error) => {
                        console.log(error)
                        notyf.error("Desculpe, ocorreu um erro");
                        setActionButton(<></>);
                    })
            }
        }
        else {
            api.post('/friends/create', {
                userEmailFriend: profileEmail,
                userEmail: emailUser
            })
                .then(() => {
                    notyf.success("Convite enviado");
                    setActionButton(<label className='action_button'><MdDone /></label>);
                })
                .catch((error) => {
                    console.log(error)
                    notyf.error("Desculpe, ocorreu um erro");
                })
            setActionButton(<></>);
        }
    }


    return (
        <div className="App">
            <Header firstLogin={location.state.firstLogin} profilePhoto={location.state.profilePhoto} coverPhoto={location.state.coverPhoto} userData={location.state.userData} hideTooltip={true} />
            <div className="main">
                <Perfil photo={urlImageCover}>
                    <div />
                </Perfil>
                <Dropdown>
                    <div className="div__dropdown">
                        <DropdownProfile />
                    </div>
                </Dropdown>
                <Content photoProfile={urlImageProfile}>
                    <div>
                        <form className="form">
                            <div className="div__main_form">
                                <div className="div__foto" />
                                <span>{userName}</span>
                                {actionButton}
                                <div>
                                    <p className="p__profileInformation">{profileInformation}</p>
                                    <p className="p__region">{city}, {region}</p>
                                </div>
                            </div>
                        </form>
                    </div>
                </Content>
                <Details>
                    <div>
                        <div className="div__span">
                            <span>Sobre</span>
                        </div>
                        <div className="div__p">
                            <p>{details}</p>
                        </div>
                    </div>
                </Details>
                {props.match.params.id ? null
                    :
                    <div className='div__feedform'>
                        <FeedForm profilePhoto={urlImageProfile} />
                    </div>
                }
                <div className="div__timeline">
                {
                    eventos.map(item => 
                        <TimeLine  key={item.id}
                            id={item.id}
                            img={item.photoName}
                            profilePhoto={item.profilePhotoUrl}
                            profileInformation={item.profileInformation}
                            title={item.title}
                            nome={item.userName}
                            horario={formatDate(item.hour)}
                            conteudo={item.text}
                            emailUser={item.userEmail}
                            profileId={item.profileId}
                            like={item.views}
                            share={item.share}
                            coments={item.coments}
                            tipo={item.typePost}
                            stateFirstLogin={location.state.firstLogin}
                            stateProfilePhoto={location.state.profilePhoto} 
                            stateCoverPhoto={location.state.coverPhoto} 
                            stateUserData={location.state.userData}/>)
                }
                </div>
            </div>
        </div>
    )
}

export default Profile;