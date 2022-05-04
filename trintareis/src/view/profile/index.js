import React, { useState, useEffect } from 'react';
import './profile.css';
import { Link } from "react-router-dom";
import Header from '../../components/header/index';
import FeedForm from '../../components/feed-form/index';
import TimeLine from '../../components/timeline_profile/index';

import firebase from '../../config/firebase';
import { useSelector } from 'react-redux';

import { Perfil, Content, Details } from './styles';

function Profile() {
    const [profileInfo, setProfileInfo] = useState([]);
    const [userName, setUserName] = useState([]);
    const [eventos, setEventos] = useState([]);
    let listEventos = [];

    const emailUser = useSelector(state => state.emailUser);

    const [urlImageProfile, setUrlImageProfile] = useState();
    const [urlImageCover, seturlImageCover] = useState();


    useEffect(() => {
        const abortController = new AbortController()

        firebase.firestore().collection('events').orderBy("dataTime", "desc").get().then(async (result) => {
            await result.docs.forEach(doc => {
                if (doc.data().emailUser === emailUser) {
                    const date = new Date(doc.data().dataTime);

                    listEventos.push({
                        id: doc.id,
                        timePublication: date.getHours() + ':' + date.getMinutes(),
                        ...doc.data()
                    })
                }
            })
        })

        firebase.firestore().collection('profiles').get().then(async (result) => {
            await result.docs.forEach(doc => {
                if (doc.data().emailUser === emailUser) {
                    firebase.storage().ref(`profile_images/${doc.data().profilePhoto}`).getDownloadURL().then(url => setUrlImageProfile(url));
                    firebase.storage().ref(`profile_images/${doc.data().coverPhoto}`).getDownloadURL().then(url => seturlImageCover(url));

                    setUserName(doc.data().userName);
                    setProfileInfo(doc.data());
                }
            })
        })
        setEventos(listEventos);

        return function cleanup() {
            abortController.abort()
        }
    }, []);

    return (
        <div className="App">
            <Header />
            <div>
                <Perfil photo={urlImageCover}>
                    <div />
                </Perfil>
                <Content photoProfile={urlImageProfile}>
                    <div>
                        <form className="form">
                            <div className="div__main_form">
                                <div className="div__foto" />
                                <div>
                                    <span>{profileInfo.userName}</span>
                                    <Link to='editProfile' style={{ textDecoration: 'none' }}>
                                        <label>Editar</label>
                                    </Link>
                                </div>
                                <div>
                                    <p className="p__profileInformation">{profileInfo.profileInformatio}</p>
                                    <p className="p__region">{profileInfo.city}, {profileInfo.region}</p>
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
                            <p>{profileInfo.details}</p>
                        </div>
                    </div>
                </Details>
                <div className='div__feedform'>
                    <FeedForm />
                </div>
                <div className="div__timeline">
                    {eventos.map(item => <TimeLine key={item.id} id={item.id} userName={userName} profileInf={profileInfo.profileInformatio} profilePhoto={urlImageProfile} img={item.photo} title={item.title} nome={item.userName} horario={item.timePublication} conteudo={item.details} />)}
                </div>
            </div>
        </div>
    )
}

export default Profile;