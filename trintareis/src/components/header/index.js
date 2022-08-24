import React, { useState, useEffect } from 'react';
import { FaHome, FaRocketchat, FaUserFriends, FaUniversity } from "react-icons/fa";
import { IoIosNotifications, IoIosSchool } from "react-icons/io";
import { MdOutlineGroups, MdExplore } from "react-icons/md";
import { GiHummingbird } from "react-icons/gi";
import { MdEventNote } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';

import './header.css';
import '../stories/stories.css'
import { Link, Redirect } from 'react-router-dom';

import firebase from '../../config/firebase';

const profileFoto = "https://firebasestorage.googleapis.com/v0/b/trintareis-23e4c.appspot.com/o/profile_foto_default%2Fperfil_second(1).png?alt=media&token=f815209f-00c0-4591-ad8b-43eda529d21b"

function Header() {
    const dispatch = useDispatch();
    const [urlImageProfile, setUrlImageProfile] = useState(profileFoto);

    const emailUser = useSelector(state => state.emailUser);

    useEffect(() => {
        const abortController = new AbortController()

        firebase.firestore().collection('profiles').get().then(async (result) => {
            await result.docs.forEach(doc => {
                if (doc.data().emailUser === emailUser) {
                    firebase.storage().ref(`profile_images/${doc.data().profilePhoto}`).getDownloadURL().then(url => setUrlImageProfile(url));
                }
            })
        })

        return function cleanup() {
            abortController.abort()
        }
    }, []);

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
                        <Link to="/home" className='headerLinkStyle'>
                            <div className="header_button">
                                <FaHome />
                                <span>Início</span>
                            </div>
                        </Link >
                        <Link to="/explore" className='headerLinkStyle'>
                            <div className="header_button">
                                <MdExplore />
                                <span>Explorar</span>
                            </div>
                        </Link>
                        <Link to="/myfriends" className='headerLinkStyle'>
                            <div className="header_button">
                                <MdOutlineGroups />
                                <span>Amigos</span>
                            </div>
                        </Link>
                        {/* TODO - ESSAS DUAS ABAS VAI FICAR OFF, NÃO DELETAR ESSE CÓDIGO
                        <div className="university__fb">
                            <FaUniversity />
                            <span>Instituições</span>
                        </div>
                        <div className="school__fb">
                            <IoIosSchool />
                            <span>Cursos</span>
                        </div> */}
                        <Link to="" className='headerLinkStyle'>
                            <div className="header_button" >
                                <MdEventNote />
                                <span>Eventos</span>
                            </div>
                        </Link>
                        <Link to="/notifications-screen" className='headerLinkStyle'>
                            <div className="header_button">
                                <IoIosNotifications />
                                <span>Notificações</span>
                            </div>
                        </Link>
                        <Link to="" className='headerLinkStyle'>
                            <div className="header_button" >
                                <FaRocketchat />
                                <span>Chat</span>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="header__right">
                    {useSelector(state => state.loggedUSer) == 0 ? <Redirect to='/' /> : null}
                    <Link to="/profile">
                        <div className="feedPost__profile">
                            <img src={urlImageProfile} />
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