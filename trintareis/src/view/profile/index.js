import './profile.css';
import React, { useState, useEffect, useContext, createContext } from 'react';
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { MdDone, MdClose } from "react-icons/md";
import { Perfil, Content, Details } from './styles';

import { isEmpty, formatDate, isURL } from '../../helpers/helper';
import Header from '../../components/header/index';
import FeedForm from '../../components/feed-form/index';
import FeedPost from '../../components/feed-post/FeedPost';
import loading from '../../resources/loading.gif';
import user from '../../resources/user.png';
import cover from '../../resources/cover.png';
import firebase from '../../config/firebase';
import NotyfContext from '../../components/notyf-toast/NotyfContext';
import api from '../../config/api';


function Profile(props) {

    const emailUser = useSelector(state => state.emailUser);
    const storage = firebase.storage();
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
    const [homeRefresh, setHomeRefresh] = useState(false);
    const [loaded, setLoaded] = useState(false);
    
    let profileEmail, idConnection = "";
    let isFriend, inviter, pending = false;
    let location = useLocation();
    let params = useParams();

    useEffect(() => {
        const abortController = new AbortController()

        if(!loaded){
            fetch();
        } else {
            api.get('/content/getContent/by-user-id/' + params.id)
            .then((response)=>{    
                let list = [];

                response.data.map(post => {
                    if(post.profileId === params.id){
                        list.push(post)
                    }
                });

                setEventos(
                    list.map(item => 
                        <div className='div_post'>
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
                                like={item.views}
                                share={item.share}
                                coments={item.coments}
                                tipo={item.typePost}
                                stateFirstLogin={location.state.firstLogin}
                                stateProfilePhoto={location.state.profilePhoto} 
                                stateCoverPhoto={location.state.coverPhoto} 
                                stateUserData={location.state.userData}
                                origin="profile"/>
                        </div>
                    )
                )
            })
        }

        return function cleanup() {
            abortController.abort()
        }
    }, [homeRefresh]);

    return (
        <div className="app">
            <Header firstLogin={location.state.firstLogin} profilePhoto={location.state.profilePhoto} coverPhoto={location.state.coverPhoto} userData={location.state.userData} origin="profile-screen" hideTooltip={true} />
            <homeRefreshContext.Provider value={{homeRefresh, setHomeRefresh}}>
                <div className="main_div">
                    <Perfil cover={urlImageCover}/>
                    <Content photoProfile={urlImageProfile}>
                        <div>
                            <form className="form">
                                <div className="div__main_form" style={{width:"500px"}}>
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
                    { !isEmpty(eventos) && eventos }
                    </div>
                </div>
            </homeRefreshContext.Provider>
        </div>
    )

    function fetch() {    

        //------------------profile usuario logado----------------------------
        if(params.id === location.state.userData.id){
            setUserName(location.state.userData.userName)   
            setProfileInformation(location.state.userData.profileInformation)
            setCity(location.state.userData.city)
            setRegion(location.state.userData.region)
            setDetails(location.state.userData.details)
            profileEmail = emailUser
            
            if(!isEmpty(location.state.profilePhoto)) { 
                if(isURL(location.state.profilePhoto)){
                    setUrlImageProfile(location.state.profilePhoto)
                } else {
                    storage.ref("profile_images/" + location.state.profilePhoto).getDownloadURL().then(url => {
                        setUrlImageProfile(url)
                        updateProfileImageURL(url)
                    })
                }
            }
            else {
                setUrlImageProfile(user)
                if(location.state.origin==="edit-images-screen-save"){ updateProfileImageURL("") }
            }
            
            if(!isEmpty(location.state.coverPhoto)) {
                if(isURL(location.state.coverPhoto)){
                    seturlImageCover(location.state.coverPhoto)
                } else {
                    storage.ref("profile_images/" + location.state.coverPhoto).getDownloadURL().then(url => {
                        seturlImageCover(url)
                        updateCoverImageURL(url)
                    })
                    
                }
            }
            else{
                if(location.state.origin==="edit-images-screen-save"){ updateCoverImageURL("") }
            }
            setLoaded(true);
        } 

        //------------------profile usuario outro----------------------------
        else {
            api.get('/profile/get-by-id/' + params.id)
            .then((response) => {
                console.log("outro profile > " + response)
                setUserName(response.data.userName)
                setProfileInformation(response.data.profileInformation)
                setDetails(response.data.details)
                setRegion(response.data.region)
                setCity(response.data.city)
                profileEmail = response.data.emailUser

                if(!isEmpty(response.data.profilePhoto)) { 
                    if (isURL(response.data.profilePhoto)) { 
                        setUrlImageProfile(response.data.profilePhoto) }
                    else {
                        storage.ref("profile_images/" + response.data.profilePhoto).getDownloadURL()
                        .then(url => setUrlImageProfile(url))}
                    }
                else {setUrlImageProfile(user)}
                
                if(!isEmpty(response.data.coverPhoto)) {  
                    if (isURL(response.data.coverPhoto)) { 
                        seturlImageCover(response.data.coverPhoto) }
                    else {
                        storage.ref("profile_images/" + response.data.coverPhoto).getDownloadURL()
                        .then(url => seturlImageCover(url))
                    }
                }
            })
            .catch((error) => {
                console.log(error)
                notyf.error("Desculpe, ocorreu um erro")
            })
            .then(()=>{
                setActionButton(<label className='action_button' onClick={actionButtonClick}>Conectar</label>)
                //
                api.get('/friends/',{
                    params : {
                        userEmail: emailUser,
                        page: 0,
                        size: 100
                    }
                })
                .then(function (response) {
                    for(let i = 0; i < response.data.content.length; i++){
                        if(response.data.content[i].id === params.id){
                            idConnection = response.data.content[i].idConnection;
                            profileEmail = response.data.content[i].userEmail;
                            inviter = response.data.content[i].inviter;
                            isFriend = true;
                            
                            if(response.data.content[i].pending){
                                pending = true;
                                if(response.data.content[i].inviter){
                                    setActionButton(<label className='action_button' onClick={actionButtonClick}>Convidado</label>);
                                } else { setActionButton(<label className='action_button' onClick={actionButtonClick}>Aceitar</label>); }
                            }
                            else{
                                setActionButton(<label className='action_button' onClick={actionButtonClick}>Desconectar</label>);
                            }
                        }
                    }
                })
                .catch((error)=>{console.log(error)})
                //
                setLoaded(true);
            })
            
        }
        setHomeRefresh(!homeRefresh)
    }

    //--------------------------------------profile action button handler--------------------
    function actionButtonClick(){
        if(isFriend){
            if(pending){
                if(inviter){
                    api.delete('/friends', {
                        params : {
                            idConnection : idConnection
                        }})
                    .then(()=>{
                        notyf.success("Conexão desfeita");
                        setActionButton(<label className='action_button'><MdClose/></label>);
                    })
                    .catch((error)=>{
                        console.log(error)
                        notyf.error("Desculpe, ocorreu um erro");
                        setActionButton(<></>);
                    })
                }
                else{
                    api.put('/friends?id=' + idConnection)
                    .then(()=>{
                        notyf.success("Convite aceito");
                        setActionButton(<label className='action_button'><MdDone/></label>);
                    })
                    .catch((error)=>{
                        console.log(error)
                        notyf.error("Desculpe, ocorreu um erro");
                        setActionButton(<></>);
                    })
                }
            }
            else {
                api.delete('/friends', {
                    params : {
                        idConnection : idConnection
                    }})
                .then(()=>{
                    notyf.success("Conexão desfeita");
                    setActionButton(<label className='action_button'><MdClose/></label>);
                })
                .catch((error)=>{
                    console.log(error)
                    notyf.error("Desculpe, ocorreu um erro");
                    setActionButton(<></>);
                })
            }
        }
        else{
            api.post('/friends/create', {
                userEmailFriend: profileEmail,
                userEmail: emailUser
            })
            .then(()=>{
                notyf.success("Convite enviado");
                setActionButton(<label className='action_button'><MdDone/></label>);
            })
            .catch((error)=>{
                console.log(error)
                notyf.error("Desculpe, ocorreu um erro");})
                setActionButton(<></>);
        }
    }

    //--------------------------------------update profile imagere ference--------------------
    function updateProfileImageURL(to){
        storage.ref("profile_images/" + to).getDownloadURL().then((url)=>{
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

    //--------------------------------------update cover image reference--------------------
    function updateCoverImageURL(to){
        storage.ref("profile_images/" + to).getDownloadURL().then((url)=>{
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
}

export default Profile;

export const homeRefreshContext = createContext();