import './home.css';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Header from '../../components/header/index'
import FeedForm from '../../components/feed-form/index';
import FeedPost from '../../components/feed-post/FeedPost';
import loading from '../../resources/loading.gif';
import user from '../../resources/user.png';

import api from '../../config/api';
import { isEmpty } from '../../helpers/helper';

function Home() {
    
    let location = useLocation();
    const [eventos, setEventos] = useState([]);
    const [urlImageProfile, setUrlImageProfile] = useState(loading);

    useEffect(() => {
        const abortController = new AbortController()       
            
            !isEmpty(location.state.profilePhoto) ? setUrlImageProfile(location.state.profilePhoto) : setUrlImageProfile(user);

            api.get('/post-content/getContent/',{
                params : {
                    page: 0,
                    size: 10
                }
            })
            .then((posts)=>{
                setEventos(posts.data.content);
            })
            .catch((error)=>{
                console.log(error)
            })
        

        return function cleanup() {
            abortController.abort()
        }
    }, []);

    function printContent(){
        console.log(eventos)
    }

    return (
        <div className="App">
            <Header firstLogin={location.state.firstLogin} profilePhoto={location.state.profilePhoto} coverPhoto={location.state.coverPhoto} userData={location.state.userData}/>
            <div className="feed_content" onClick={printContent}>
                <FeedForm profilePhoto={urlImageProfile} />
                {eventos.map(item => 
                    <FeedPost key={item.id}
                        id={item.id}
                        img={item.photoName}
                        profilePhoto={item.profilePhotoUrl}
                        profileInformation={item.profileInformation}
                        title={item.title}
                        nome={item.userName}
                        horario={item.hour}
                        conteudo={item.title}
                        emailUser={item.userEmail}
                        profileId={item.profileId}
                        like={item.views}
                        share={item.share}
                        coments={item.coments}/>)
                }
            </div>
        </div>
    )
}

export default Home;
