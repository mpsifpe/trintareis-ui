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
    const [urlImageProfile, setUrlImageProfile] = useState(profileFoto);

    let listEventos = [];
    let listProfiles = [];

    const emailUser = useSelector(state => state.emailUser);

    useEffect(() => {
        const abortController = new AbortController()

        async function fetch() {
            const profiles = await firebase.firestore().collection('profiles').get();

            for (const doc of profiles.docs) {
                console.log(doc.data().emailUser);

                if (doc.data().emailUser === emailUser) {
                    const url = await firebase.storage().ref(`profile_images/${doc.data().profilePhoto}`).getDownloadURL();
                    setUrlImageProfile(url);
                }

                listProfiles.push({
                    id: doc.id,
                    ...doc.data()
                })
            }

            const events = await firebase.firestore().collection('events').orderBy("dataTime", "desc").get();

            for (const doc of events.docs) {
                if (!isEmpty(listProfiles)) {
                    for (const docProfile of listProfiles) {
                        if (doc.data().emailUser === docProfile.emailUser) {
                            const url = await firebase.storage().ref(`profile_images/${docProfile.profilePhoto}`).getDownloadURL();
                            listEventos.push({
                                id: doc.id,
                                profileId: docProfile.id,
                                userName: docProfile.userName,
                                profileInformation: docProfile.profileInformatio,
                                profilePhoto: url,
                                ...doc.data()
                            })
                        }
                    }
                }
            }
        }

        fetch().then(() => {
            setEventos(listEventos);
        });

        return function cleanup() {
            abortController.abort()
        }
    }, []);

    function isEmpty(value) {
        return (value == null || value.length === 0);
    }

    return (
        <div className="App">
            <Header />
            <div className="feed_content">
                <FeedForm />
                {eventos.map(item => <FeedPost key={item.id} id={item.id} img={item.photo} title={item.title} nome="Trinta Reis" horario={item.hour} conteudo={item.details} like={item.like}  share={item.share} coments={item.coments}/>)}
            </div>
        </div>
    )
}

export default Home;