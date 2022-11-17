import './home.css';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/header/index'
import FeedForm from '../../components/feed-form/index';
import FeedPost from '../../components/feed-post/FeedPost';
import firebase from '../../config/firebase';
import loading from '../../resources/loading.gif';
import user from '../../resources/user.png';

const loadingGif = loading;

function Home() {
    let location = useLocation();
    const [eventos, setEventos] = useState([]);
    const [urlImageProfile, setUrlImageProfile] = useState(loadingGif);

    let listEventos = [];
    let listProfiles = [];


    useEffect(() => {
        const abortController = new AbortController()

        async function fetch() {            
            
            if(!isEmpty(location.state.profilePhoto)){
                
                await firebase.storage().ref("profile_images/" + location.state.profilePhoto).getDownloadURL()
                .then(url => setUrlImageProfile(url))
                .catch((error)=>{
                    console.log(error)
                    setUrlImageProfile(user)
                })
            } else {
                setUrlImageProfile(user)
            }

            const profiles = await firebase.firestore().collection('profiles').get();
            for (const doc of profiles.docs) {
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
            <Header firstLogin={location.state.firstLogin} profilePhoto={location.state.profilePhoto} coverPhoto={location.state.coverPhoto} userData={location.state.userData}/>
            <div className="feed_content">
                <FeedForm profilePhoto={urlImageProfile} />
                {eventos.map(item => <FeedPost key={item.id} id={item.id} img={item.photo} profilePhoto={item.profilePhoto} profileInformation={item.profileInformation} title={item.title} nome={item.userName} horario={item.hour} conteudo={item.details} emailUser={item.emailUser} profileId={item.profileId} like={item.like}  share={item.share} coments={item.coments} />)}
            </div>
        </div>
    )
}

export default Home;
