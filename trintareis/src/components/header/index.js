import './header.css';
import '../stories/stories.css';

import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { IoNotificationsOutline, IoHomeOutline, IoPeopleOutline, IoCompassOutline, IoChatbubblesOutline, IoLogOutOutline, IoSchoolOutline } from "react-icons/io5";
import { GiHummingbird } from "react-icons/gi";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { isEmpty, isURL } from '../../helpers/helper';

import firebase from '../../config/firebase';
import user from '../../resources/user.png';
import loading from '../../resources/loading.gif';
import NotyfContext from '../notyf-toast/NotyfContext';

function Header(props) {
    
    const dispatch = useDispatch();
    const notyf = useContext(NotyfContext);
    const storage = firebase.storage();

    const [urlImageProfile, setUrlImageProfile] = useState(<img src={loading} style={{opacity: '0.75'}} alt="loading"/>);
    const [profileID, setProfileID] = useState("");

    useEffect(() => {
        const abortController = new AbortController()

        setProfileID(props.userData.id);

        if (isEmpty(props.profilePhoto)){
            setUrlImageProfile(<img src={user}/>);
        } 
        else {
            if(isURL(props.profilePhoto)){
                setUrlImageProfile(<img src={props.profilePhoto}/>);
            }
            else {
                storage.ref("profile_images/" + props.profilePhoto).getDownloadURL().then(url => {
                    setUrlImageProfile(<img src={url}/>);
                })
            }
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
                                        userData: props.userData,
                                        origin: props.origin }}}>
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
                                                        userData: props.userData,
                                                        origin: props.origin }}} className='headerLinkStyle'>
                            <div className="header_button">
                                <IoHomeOutline className='icon_button' />
                                <span hidden={true}>Início</span>
                            </div>
                        </Link >
                        <Link to={{pathname: "/explore", state: {
                                                            firstLogin: props.firstLogin, 
                                                            profilePhoto: props.profilePhoto, 
                                                            coverPhoto: props.coverPhoto, 
                                                            userData: props.userData,
                                                            origin: props.origin }}} className='headerLinkStyle'>
                            <div className="header_button">
                                <IoCompassOutline className='icon_button'/>
                                <span hidden={true}>Explorar</span>
                            </div>
                        </Link>
                        <Link to={{pathname: "/myfriends", state: {
                                                            firstLogin: props.firstLogin, 
                                                            profilePhoto: props.profilePhoto, 
                                                            coverPhoto: props.coverPhoto, 
                                                            userData: props.userData,
                                                            origin: props.origin }}} className='headerLinkStyle'>
                            <div className="header_button">
                                <IoPeopleOutline className='icon_button'/>
                                <span hidden={true}>Amigos</span>
                            </div>
                        </Link>
                        <Link to={{pathname: "/career", state: {
                                                            firstLogin: props.firstLogin, 
                                                            profilePhoto: props.profilePhoto, 
                                                            coverPhoto: props.coverPhoto, 
                                                            userData: props.userData,
                                                            origin: props.origin }}} className='headerLinkStyle'>
                            <div className="header_button">
                                <IoSchoolOutline className='icon_button'/>
                                <span hidden={true}>Carreira</span>
                            </div>
                        </Link>
                        
                        <div className='headerLinkStyle'>
                            <div className="header_button" onClick={notifyBuilding}>
                                <IoNotificationsOutline className='icon_button'/>
                                <span hidden={true}>Notificações</span>
                            </div>
                        </div>
                        
                        <div className='headerLinkStyle' >
                            <div className="header_button" onClick={notifyBuilding} >
                                <IoChatbubblesOutline className='icon_button'/>
                                <span hidden={true}>Chat</span>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="header__right">
                    {useSelector(state => state.loggedUSer) === 0 ? <Redirect to='/'/> : null}
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <div className="img_profile" id="profile_img">
                                {urlImageProfile}
                            </div>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
                                <Link to={{ pathname: "/profile/" + profileID, 
                                    state: {
                                        firstLogin: props.firstLogin, 
                                        profilePhoto: props.profilePhoto, 
                                        coverPhoto: props.coverPhoto, 
                                        userData: props.userData,
                                        origin: props.origin }}} className='headerLinkStyle'>
                                    <DropdownMenu.Item className="DropdownMenuItem">Meu perfil</DropdownMenu.Item>
                                </Link>
                                <DropdownMenu.Separator className="DropdownMenuSeparator" />
                                <Link to={{ pathname: "/editProfile", 
                                    state: {
                                        firstLogin: props.firstLogin, 
                                        profilePhoto: props.profilePhoto, 
                                        coverPhoto: props.coverPhoto, 
                                        userData: props.userData,
                                        origin: props.origin  }}} className='headerLinkStyle'>
                                    <DropdownMenu.Item className="DropdownMenuItem">Editar perfil</DropdownMenu.Item>
                                </Link>
                                <Link to={{ pathname: "/editImages", 
                                    state: {
                                        firstLogin: props.firstLogin, 
                                        profilePhoto: props.profilePhoto, 
                                        coverPhoto: props.coverPhoto, 
                                        userData: props.userData,
                                        image: "profile" ,
                                        origin: props.origin  }}} className='headerLinkStyle'>
                                    <DropdownMenu.Item className="DropdownMenuItem">Editar foto do perfil</DropdownMenu.Item>
                                </Link>
                                <Link to={{ pathname: "/editImages", 
                                    state: {
                                        firstLogin: props.firstLogin, 
                                        profilePhoto: props.profilePhoto, 
                                        coverPhoto: props.coverPhoto, 
                                        userData: props.userData,
                                        image: "cover"  ,
                                        origin: props.origin  }}} className='headerLinkStyle'>
                                    <DropdownMenu.Item className="DropdownMenuItem">Editar imagem de capa</DropdownMenu.Item>
                                </Link>
                                <DropdownMenu.Separator className="DropdownMenuSeparator" />
                                <DropdownMenu.Item className="DropdownMenuItem" onClick={() => dispatch({ type: 'LOG_OUT' })}>Sair</DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            </div>
        </div>
    )
}

export default Header;