import './home.css';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Header from '../../components/header/index'
import FeedForm from '../../components/feed-form/index';
import FeedPost from '../../components/feed-post/FeedPost';
import loading from '../../resources/loading.gif';
import user from '../../resources/user.png';

import api from '../../config/api';
import firebase from '../../config/firebase';
import { isEmpty } from '../../helpers/helper';

function Home() {
    let location = useLocation();
    const [eventos, setEventos] = useState([]);
    const [test, setTest] = useState([]);

    const [urlImageProfile, setUrlImageProfile] = useState(loading);

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

            api.get('/post-content/getContent/',{
                params : {
                    page: 0,
                    size: 10
                }
            })
            .then((posts)=>{
                setTest(posts.data.content);

                posts.data.content.forEach(post => {    
                    api.get('/profile/' + post.userEmail)
                    .then((profile) => {
                        setEventos({ ...eventos, response: profile})(
                            {
                                id: profile.data.id,
                                img: post.photoName,
                                profilePhoto: profile.data.profilePhoto, 
                                profileInformation: profile.data.profileInformation,
                                title: post.title,
                                nome: profile.data.userName,
                                horario: post.hour,
                                conteudo: post.details,
                                emailUser: post.userEmail,
                                profileId: profile.data.id, 
                                like: post.like,
                                share: post.share,
                                coments: post.coments
                            }
                        )
                    })
                    .catch(error => console.log(error))
                });
            })
            .catch((error)=>{
                console.log(error)
            })

        }

        fetch();
        

        return function cleanup() {
            abortController.abort()
        }
    }, []);

    function printContent(){
        console.log(test)
    }

    return (
        <div className="App">
            <Header firstLogin={location.state.firstLogin} profilePhoto={location.state.profilePhoto} coverPhoto={location.state.coverPhoto} userData={location.state.userData}/>
            <div className="feed_content" onClick={printContent}>
                <FeedForm profilePhoto={urlImageProfile} />
                {eventos.map(item => <FeedPost key={item.id} id={item.id} img={item.photo} profilePhoto={item.profilePhoto} profileInformation={item.profileInformation} title={item.title} nome={item.userName} horario={item.hour} conteudo={item.details} emailUser={item.emailUser} profileId={item.profileId} like={item.like}  share={item.share} coments={item.coments} />)
                }
            </div>
        </div>
    )
}

export default Home;
