import React, { useState, useEffect } from 'react';
import './profile.css';
import { Link } from "react-router-dom";
import Header from '../../components/header/index';
import FeedForm from '../../components/feed-form/index';
import TimeLine from '../../components/timeline_profile/index';

import firebase from '../../config/firebase';
import { useSelector } from 'react-redux';

import { Perfil, Content, Details } from './styles';

const profileFoto = "https://firebasestorage.googleapis.com/v0/b/trintareis-23e4c.appspot.com/o/profile_foto_default%2Fperfil_second(1).png?alt=media&token=f815209f-00c0-4591-ad8b-43eda529d21b"

function Profile() {
    const [profileInfo, setProfileInfo] = useState([]);
    const [userName, setUserName] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [idDoc, setIdDoc] = useState();
    let listEventos = [];

    const emailUser = useSelector(state => state.emailUser);
    const loggedUSer = useSelector(state => state.loggedUSer);

    const [urlImageProfile, setUrlImageProfile] = useState(profileFoto);
    const [urlImageCover, seturlImageCover] = useState();


    useEffect(() => {
        const abortController = new AbortController()

        async function fetch(){
            const events = await firebase.firestore().collection('events').orderBy("dataTime", "desc").get();
            for (const doc of events.docs) {
                if (doc.data().emailUser === emailUser) {
                    const date = new Date(doc.data().dataTime);
                    listEventos.push({
                        id: doc.id,
                        timePublication: date.getHours() + ':' + date.getMinutes(),
                        ...doc.data()
                    })
                }
            }

            const profiles = await firebase.firestore().collection('profiles').get();
            for (const doc of profiles.docs) {
                if (doc.data().emailUser === emailUser) {
                    if(!isEmpty(doc.data().profilePhoto)){
                        const url = await firebase.storage().ref(`profile_images/${doc.data().profilePhoto}`).getDownloadURL();
                        setUrlImageProfile(url);
                    }
                    const urlCover = await firebase.storage().ref(`profile_images/${doc.data().coverPhoto}`).getDownloadURL().catch(() => {
                        return profileFoto;
                    });
                    console.log(urlCover);
                    
                    seturlImageCover(urlCover);
                    setIdDoc(doc.id);
                    setUserName(doc.data().userName);
                    setProfileInfo(doc.data());
                }
            }

        }
        
        fetch().then(() => {
            setEventos(listEventos);
        })

        return function cleanup() {
            abortController.abort()
        }
    }, []);

    function isEmpty(value){
        return (value == null || value.length === 0);
      }

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
                                    <Link to={idDoc ? `/editProfile/${idDoc}` : `/editProfile`} style={{ textDecoration: 'none' }}>
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
                    <FeedForm profilePhoto={urlImageProfile}/>
                </div>
                <div className="div__timeline">
                    {eventos.map(item => <TimeLine key={item.id} id={item.id} userName={userName} profileInf={profileInfo.profileInformatio} profilePhoto={urlImageProfile} img={item.photo} title={item.title} nome={item.userName} horario={item.timePublication} conteudo={item.details} />)}
                </div>
            </div>
        </div>
    )
}

export default Profile;