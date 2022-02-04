import React, { useState, useEffect } from 'react';
import { FaHome, FaRocketchat, FaUserFriends, FaUniversity } from "react-icons/fa";
import { IoIosNotifications, IoIosSchool } from "react-icons/io";
import { MdOutlineGroups } from "react-icons/md";
import { GiHummingbird } from "react-icons/gi";
import { MdEventNote } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';

import './header.css';
import '../stories/stories.css'
import { Link, Redirect } from 'react-router-dom';

function Header() {
    const dispatch = useDispatch();

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
                    <Link to="/home">
                        <div className="home__fb">
                            <FaHome />
                            <span>Início</span>
                        </div>
                    </Link>
                        <div className="friend__fb">
                            <FaUserFriends />
                            <span>Rede</span>
                        </div>
                        <Link to="/myfriends">
                            <div className="group__fb link_preto">
                                <MdOutlineGroups />
                                <span>Amigos</span>
                            </div>
                        </Link>
                        <div className="university__fb">
                            <FaUniversity />
                            <span>Instituições</span>
                        </div>
                        <div className="school__fb">
                            <IoIosSchool />
                            <span>Cursos</span>
                        </div>
                        <div className="event__fb">
                            <MdEventNote />
                            <span>Eventos</span>
                        </div>
                        <div className="notification__fb">
                            <IoIosNotifications />
                            <span>Notificações</span>
                        </div>
                        <div className="chat__fb">
                            <FaRocketchat />
                            <span>Chat</span>
                        </div>
                    </div>
                </div>
                <div className="header__right">
                    {/* {useSelector(state => state.loggedUSer) == 0 ? <Redirect to='/' /> : null} */}
                    <div className="div__plus_btn">
                        <span onClick={() => dispatch({ type: 'LOG_OUT' })}>Sair</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;