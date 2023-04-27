import './home.css';
import React, { useState, useEffect, useContext, createContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Header from '../../components/header/index'
import FeedForm from '../../components/feed-form/index';
import FeedPost from '../../components/feed-post/FeedPost';
import loading from '../../resources/loading.gif';
import user from '../../resources/user.png';

import api from '../../config/api';
import firebase from '../../config/firebase';
import { isEmpty, formatDate, isURL } from '../../helpers/helper';

export const refreshContext = createContext();

export default function Home() {
    
    let location = useLocation();
    const storage = firebase.storage();
    const emailUser = useSelector(state => state.emailUser);

    const [posts, setPosts] = useState([]);
    const [urlImageProfile, setUrlImageProfile] = useState(loading);
    const [data, setData] = useState({});
    const [urlUpdated, setUrlUpdated] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const abortController = new AbortController()       
        
        setData({ 
            id: location.state.userData.id,
            userName: location.state.userData.userName,
            profileInformation: location.state.userData.profileInformation,
            details: location.state.userData.details,
            region: location.state.userData.region,
            city: location.state.userData.city })
        
                    //update imagem profile
        if(isEmpty(location.state.profilePhoto)) { 
            setUrlImageProfile(user); 
        }
        else {
            if(isURL(location.state.profilePhoto)){
                setUrlImageProfile(location.state.profilePhoto)
            } else {
                storage.ref("profile_images/" + location.state.profilePhoto).getDownloadURL().then(url => {
                    setUrlImageProfile(url);
                    
                    api.put('/profile/update', {
                        "id": location.state.userData.id,
                        "city": location.state.userData.city,
                        "details": location.state.userData.details,
                        "coverPhoto": location.state.coverPhoto,
                        "profileInformation": location.state.userData.profileInformation,
                        "profilePhoto": url,
                        "emailUser": emailUser,
                        "region": location.state.userData.region,
                        "userName": location.state.userData.userName
                    })          
                })
            }
        }

        fetch();
        
        //update imagem cover
        if(!isURL(location.state.coverPhoto)){
            storage.ref("profile_images/" + location.state.coverPhoto).getDownloadURL().then(url => {                
                api.put('/profile/update', {
                    "id": location.state.userData.id,
                    "city": location.state.userData.city,
                    "details": location.state.userData.details,
                    "coverPhoto": url,
                    "profileInformation": location.state.userData.profileInformation,
                    "profilePhoto": location.state.profilePhoto,
                    "emailUser": emailUser,
                    "region": location.state.userData.region,
                    "userName": location.state.userData.userName
                })          
            })
        }

        return function cleanup() {
            abortController.abort()
        }
    }, [refresh]);

    function fetch(){
        api.get('/content/getContent/',{
            params : {
                page: 0,
                size: 10
            }
        })
        .then((response)=>{
            setPosts(response.data.content.map(item => 
                <FeedPost key={item.id}
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
                    like={item.likes}
                    share={item.share}
                    coments={item.coments}
                    tipo={item.typePost}
                    stateFirstLogin={location.state.firstLogin}
                    stateProfilePhoto={location.state.profilePhoto} 
                    stateCoverPhoto={location.state.coverPhoto} 
                    stateUserData={location.state.userData}/>));
            setRefresh(false);
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    return (
        <div className="App">
            <Header 
                firstLogin={location.state.firstLogin} 
                profilePhoto={urlUpdated ? urlImageProfile : location.state.profilePhoto} 
                coverPhoto={location.state.coverPhoto} 
                userData={location.state.userData}
                id={location.state.userData.id}
                origin="home"/>
            <refreshContext.Provider value={{refresh, setRefresh}}>
                <div className="feed_content">
                    <FeedForm profilePhoto={urlImageProfile} stateFirstLogin={location.state.firstLogin} stateProfilePhoto={location.state.profilePhoto} stateCoverPhoto={location.state.coverPhoto} stateUserData={location.state.userData}/>
                    {posts}
                </div>
            </refreshContext.Provider>
        </div>
    )
}