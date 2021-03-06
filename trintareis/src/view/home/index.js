import React, { useState, useEffect } from 'react';
import './home.css';
import Header from '../../components/header/index'
import FeedForm from '../../components/feed-form/index';
import FeedPost from '../../components/feed-post/FeedPost';
import firebase from '../../config/firebase';

import { useSelector } from 'react-redux';
const profileFoto = "https://firebasestorage.googleapis.com/v0/b/trintareis-23e4c.appspot.com/o/profile_foto_default%2Fperfil_second(1).png?alt=media&token=f815209f-00c0-4591-ad8b-43eda529d21b"

function Home() {
    const [eventos, setEventos] = useState([]);
    const [profileInformation, setProfileInformation] = useState('');
    const [urlImageProfile, setUrlImageProfile] = useState(profileFoto);
    const [userName, setUserName] = useState('');
    let listEventos = [];

    const emailUser = useSelector(state => state.emailUser);

    useEffect(() => {
        const abortController = new AbortController()

        firebase.firestore().collection('profiles').get().then(async (result) => {
            await result.docs.forEach(doc => {
                if (doc.data().emailUser === emailUser) {
                    firebase.storage().ref(`profile_images/${doc.data().profilePhoto}`).getDownloadURL().then(url => setUrlImageProfile(url));
                    setProfileInformation(doc.data().profileInformatio);
                    setUserName(doc.data().userName);
                }
            })
        })

        firebase.firestore().collection('events').orderBy("dataTime", "desc").get().then(async (result) => {
            await result.docs.forEach(doc => {
                listEventos.push({
                    id: doc.id,
                    profileInformation: profileInformation,
                    ...doc.data()
                })
            })
            setEventos(listEventos);
        })

        return function cleanup() {
            abortController.abort()
        }
    }, []);

    return (
        <div className="App">
            <Header />
            <div className="feed_content">
                <FeedForm profilePhoto={urlImageProfile} />
                {eventos.map(item => <FeedPost key={item.id} id={item.id} img={item.photo} profilePhoto={urlImageProfile} profileInformation={profileInformation} title={item.title} nome={userName} horario={item.hour} conteudo={item.details} />)}
            </div>
        </div>
    )
}

export default Home;