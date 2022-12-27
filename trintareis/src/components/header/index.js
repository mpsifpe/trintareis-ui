import React, { useState, useEffect, useContext } from 'react';
import { FaHome, FaRocketchat} from "react-icons/fa";
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
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css';

function Header(props) {
    const dispatch = useDispatch();
    const [urlImageProfile, setUrlImageProfile] = useState(<img src={loading} style={{opacity: '0.75'}} alt="loading"/>);
    const notyf = useContext(NotyfContext);
    const [showTooltip, setShowTooltip] = useState(<Tooltip anchorId="profile_img" place="bottom" style={{opacity:0.35, color:'white'}} positionStrategy="absolute"/>)

    useEffect(() => {
        const abortController = new AbortController()
        
        if(!isEmpty(props.profilePhoto)){
            firebase.storage().ref("profile_images/" + props.profilePhoto).getDownloadURL().then(url => setUrlImageProfile(<img src={url} style={{opacity: '1'}} alt="profile image"/>));
        } else {
            setUrlImageProfile(<img src={user} style={{opacity: '1.0'}}/>)
        }

        if(!isEmpty(props.hideTooltip)){
            if (props.hideTooltip){ setShowTooltip(<></>)}
        }

        return function cleanup() {
            abortController.abort()
        }
    },[]);

    function notifyBuilding(){

        notyf.open({
            type: 'info',
            message: 'Em desenvolvimento'
          });
    }

    return (
        <div className="App">
            <div className="header">
                <div className="header__left">
                    <div className="div__logo">
                        <Link to={{ pathname: "/home", 
                                    state: {
                                        firstLogin: props.firstLogin, 
                                        profilePhoto: props.profilePhoto, 
                                        coverPhoto: props.coverPhoto, 
                                        userData: props.userData }}}>
                            <div className="logo__fb">
                                <GiHummingbird />
                            </div>
                        </Link>    
                        <div className="search__fb" onClick={notifyBuilding}>
                            <input type="search" name="header_search_query" placeholder="Pesquisar" />
                        </div>
                    </div>
                </div>
                <div className="header__center">
                    <div className="div__content_header">
                        <Link to={{pathname: "/home", state: {
                                                        firstLogin: props.firstLogin, 
                                                        profilePhoto: props.profilePhoto, 
                                                        coverPhoto: props.coverPhoto, 
                                                        userData: props.userData }}} className='headerLinkStyle'>
                            <div className="header_button">
                                <FaHome className='icon_button' />
                                <span>Início</span>
                            </div>
                        </Link >
                        <Link to={{pathname: "/explore", state: {
                                                            firstLogin: props.firstLogin, 
                                                            profilePhoto: props.profilePhoto, 
                                                            coverPhoto: props.coverPhoto, 
                                                            userData: props.userData }}} className='headerLinkStyle'>
                            <div className="header_button">
                                <MdExplore className='icon_button'/>
                                <span>Explorar</span>
                            </div>
                        </Link>
                        <Link to={{pathname: "/myfriends", state: {
                                                            firstLogin: props.firstLogin, 
                                                            profilePhoto: props.profilePhoto, 
                                                            coverPhoto: props.coverPhoto, 
                                                            userData: props.userData }}} className='headerLinkStyle'>
                            <div className="header_button">
                                <MdOutlineGroups className='icon_button'/>
                                <span>Amigos</span>
                            </div>
                        </Link>
                        {/*
                        <Link to="" className='headerLinkStyle'>
                            <div className="header_button" >
                                <MdEventNote />
                                <span>Eventos</span>
                            </div>
                        </Link>*/}
                        
                        <div className='headerLinkStyle'>
                            <div className="header_button" onClick={notifyBuilding}>
                                <IoIosNotifications className='icon_button'/>
                                <span>Notificações</span>
                            </div>
                        </div>
                        
                        <div className='headerLinkStyle'>
                            <div className="header_button" onClick={notifyBuilding}>
                                <FaRocketchat className='icon_button'/>
                                <span>Chat</span>
                            </div>
                        </div>
                        
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
                        
                        <div className="img_profile" id="profile_img" data-tooltip-content="Meu perfil">
                            {urlImageProfile}
                        </div>
                        {showTooltip}
                    </Link>
                    <div className="logout_btn">
                        <span onClick={() => dispatch({ type: 'LOG_OUT' })} className="logout_button_span">Sair</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;