import './profile.css';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';

import { Perfil, Content, Details } from './styles';
import { isEmpty } from '../../helpers/helper';
import Header from '../../components/header/index';
import FeedForm from '../../components/feed-form/index';
import TimeLine from '../../components/timeline_profile/index';
import loading from '../../resources/loading.gif';
import user from '../../resources/user.png';
import cover from '../../resources/cover.png';
import firebase from '../../config/firebase';


function Profile(props) {

    const emailUser = useSelector(state => state.emailUser);
    const storage = firebase.storage();
    const events = firebase.firestore().collection('events');

    const [eventos, setEventos] = useState([]);
    const [urlImageProfile, setUrlImageProfile] = useState(loading);
    const [urlImageCover, seturlImageCover] = useState(cover);
    
    let location = useLocation();
    let listEventos = [];

    useEffect(() => {
        const abortController = new AbortController()

        async function fetch() { 

            //load profile photo
            if(!isEmpty(location.state.profilePhoto)) { 
                storage.ref("profile_images/" + location.state.profilePhoto).getDownloadURL()
                .then(url => setUrlImageProfile(url))}
            else {setUrlImageProfile(user)}
            
            //load cover photo
            if(!isEmpty(location.state.coverPhoto)) {  
                storage.ref("profile_images/" + location.state.coverPhoto).getDownloadURL()
                .then(url => seturlImageCover(url))}
            
    
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

        fetch().then(() => {
            setEventos(listEventos);
            })

        return function cleanup() {
            abortController.abort()
        }
    }, []);



    return (
        <div className="App">
            <Header firstLogin={location.state.firstLogin} profilePhoto={location.state.profilePhoto} coverPhoto={location.state.coverPhoto} userData={location.state.userData}/>
            <div className="main">
                <Perfil photo={urlImageCover}>
                    <div />
                </Perfil>
                <Content photoProfile={urlImageProfile}>
                    <div>
                        <form className="form">
                            <div className="div__main_form">
                                <div className="div__foto" />
                                    <span>{location.state.userData.userName}</span>
                                    {props.match.params.id ? null
                                        :
                                        <Link to={{pathname: '/editProfile', state: location.state}} style={{ textDecoration: 'none' }}>
                                            <label style={{margin: "0"}}>Editar</label>
                                        </Link>
                                    }
                                <div>
                                    <p className="p__profileInformation">{location.state.userData.profileInformation}</p>
                                    <p className="p__region">{location.state.userData.city}, {location.state.userData.region}</p>
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
                            <p>{location.state.userData.details}</p>
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
                    {eventos.map(item => <TimeLine key={item.id} id={item.id} userName={item.userName} profileInf={item.profileInformatio} profilePhoto={urlImageProfile} img={item.photo} title={item.title} nome={item.userName} horario={item.timePublication} conteudo={item.details} />)}
                </div>
            </div>
        </div>
    )
}

export default Profile;