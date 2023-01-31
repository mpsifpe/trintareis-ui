import React, { useState, useEffect, useContext } from 'react';
import { IoNotificationsOutline, IoHomeOutline, IoPeopleOutline, IoCompassOutline, IoChatbubblesOutline, IoLogOutOutline } from "react-icons/io5";
import { GiHummingbird } from "react-icons/gi";
import { useSelector, useDispatch } from 'react-redux';

import './header.css';
import '../stories/stories.css'
import { Link, Redirect } from 'react-router-dom';
import loading from '../../resources/loading.gif';
import user from '../../resources/user.png';
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
        
        !isEmpty(props.profilePhoto) ? setUrlImageProfile(props.profilePhoto) : setUrlImageProfile(user);

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
                                <IoHomeOutline className='icon_button' />
                                <span hidden={true}>Início</span>
                            </div>
                        </Link >
                        <Link to={{pathname: "/explore", state: {
                                                            firstLogin: props.firstLogin, 
                                                            profilePhoto: props.profilePhoto, 
                                                            coverPhoto: props.coverPhoto, 
                                                            userData: props.userData }}} className='headerLinkStyle'>
                            <div className="header_button">
                                <IoCompassOutline className='icon_button'/>
                                <span hidden={true}>Explorar</span>
                            </div>
                        </Link>
                        <Link to={{pathname: "/myfriends", state: {
                                                            firstLogin: props.firstLogin, 
                                                            profilePhoto: props.profilePhoto, 
                                                            coverPhoto: props.coverPhoto, 
                                                            userData: props.userData }}} className='headerLinkStyle'>
                            <div className="header_button">
                                <IoPeopleOutline className='icon_button'/>
                                <span hidden={true}>Amigos</span>
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
                                <IoNotificationsOutline className='icon_button'/>
                                <span hidden={true}>Notificações</span>
                            </div>
                        </div>
                        
                        <div className='headerLinkStyle' data-tooltip-content="Chat">
                            <div className="header_button" onClick={notifyBuilding} >
                                <IoChatbubblesOutline className='icon_button'/>
                                <span hidden={true}>Chat</span>
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
                            <img src={urlImageProfile}/>
                        </div>
                        
                    </Link>
                    <div className="header_button">
                        <span onClick={() => dispatch({ type: 'LOG_OUT' })}>
                            <IoLogOutOutline className='icon_button'/>
                        </span>
                    </div>
                </div>
            </div>
            {showTooltip}
        </div>
    )
}

export default Header;