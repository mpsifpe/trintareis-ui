import React, { useState, useEffect, useContext } from 'react';
import { FaHome/*, FaRocketchat*/} from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { MdOutlineGroups, MdExplore } from "react-icons/md";
import { GiHummingbird } from "react-icons/gi";
//import { MdEventNote } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';

import './header.css';
import '../stories/stories.css'
import { Link, Redirect } from 'react-router-dom';
import loading from '../../resources/loading.gif';
import user from '../../resources/user.png';
import firebase from '../../config/firebase';
import { isEmpty } from '../../helpers/helper';
import NotyfContext from '../notyf-toast/NotyfContext';

function Header(props) {
    const dispatch = useDispatch();
    const [urlImageProfile, setUrlImageProfile] = useState(<img src={loading} style={{opacity: '0.75'}} alt="loading"/>);
    const notyf = useContext(NotyfContext);

    useEffect(() => {
        const abortController = new AbortController()
        
        if(!isEmpty(props.profilePhoto)){
            firebase.storage().ref("profile_images/" + props.profilePhoto).getDownloadURL().then(url => setUrlImageProfile(<img src={url} style={{opacity: '1'}} alt="profile image"/>));
        } else {
            setUrlImageProfile(<img src={user} style={{opacity: '1.0'}}/>)
        }

        return function cleanup() {
            abortController.abort()
        }
    },[]);

    function notifyBuilding(){
        notyf.error("Em desenvolvimento")
    }

    return (
        <div className="App">
            <div className="header">
                <div className="header__left">
                    <div className="div__logo">
                        <div className="logo__fb">
                            <GiHummingbird />
                        </div>
                        <div className="search__fb">
                            <input type="search" name="header_search_query" placeholder="Pesquisar" />
                        </div>
                    </div>
                    <div className="div__content_header">
                        <Link to={{pathname: "/home", state: {
                                                        firstLogin: props.firstLogin, 
                                                        profilePhoto: props.profilePhoto, 
                                                        coverPhoto: props.coverPhoto, 
                                                        userData: props.userData }}} className='headerLinkStyle'>
                            <div className="header_button">
                                <FaHome />
                                <span>Início</span>
                            </div>
                        </Link >
                        <Link to={{pathname: "/explore", state: {
                                                            firstLogin: props.firstLogin, 
                                                            profilePhoto: props.profilePhoto, 
                                                            coverPhoto: props.coverPhoto, 
                                                            userData: props.userData }}} className='headerLinkStyle'>
                            <div className="header_button">
                                <MdExplore />
                                <span>Explorar</span>
                            </div>
                        </Link>
                        <Link to={{pathname: "/myfriends", state: {
                                                            firstLogin: props.firstLogin, 
                                                            profilePhoto: props.profilePhoto, 
                                                            coverPhoto: props.coverPhoto, 
                                                            userData: props.userData }}} className='headerLinkStyle'>
                            <div className="header_button">
                                <MdOutlineGroups />
                                <span>Amigos</span>
                            </div>
                        </Link>
                        {/*
                        <Link to="" className='headerLinkStyle'>
                            <div className="header_button" >
                                <MdEventNote />
                                <span>Eventos</span>
                            </div>
                        </Link>
                        
                        <Link to={{pathname: "/notifications-screen", state: {
                                                                        firstLogin: props.firstLogin, 
                                                                        profilePhoto: props.profilePhoto, 
                                                                        coverPhoto: props.coverPhoto, 
                                                                        userData: props.userData }}} className='headerLinkStyle'>*/}
                            <div className="header_button" onClick={notifyBuilding}>
                                <IoIosNotifications />
                                <span>Notificações</span>
                            </div>
                        {//</Link>
                                }
                        {/*
                        <Link to="" className='headerLinkStyle'>
                            <div className="header_button" >
                                <FaRocketchat />
                                <span>Chat</span>
                            </div>
                        </Link>
                        */}
                    </div>
                </div>
                <div className="header__right">
                    {useSelector(state => state.loggedUSer) === 0 ? <Redirect to='/'/> : null}
                    <Link to={{ pathname: "/profile/" + props.userData.id, 
                                state: {
                                    firstLogin: props.firstLogin, 
                                    profilePhoto: props.profilePhoto, 
                                    coverPhoto: props.coverPhoto, 
                                    userData: props.userData }}}>
                        <div className="feedPost__profile">
                            {urlImageProfile}
                        </div>
                    </Link>
                    <div className="div__plus_btn">
                        <span onClick={() => dispatch({ type: 'LOG_OUT' })}>Sair</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;