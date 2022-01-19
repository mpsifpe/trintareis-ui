import React, { useState, useEffect } from 'react';
import { FaHome, FaRocketchat, FaEarlybirds, FaUserFriends, FaUniversity, FaSearch } from "react-icons/fa";
import { IoIosNotifications, IoIosSchool } from "react-icons/io";
import { MdOutlineGroups } from "react-icons/md";
import firebase from '../../config/firebase';
import { MdEventNote } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';


import Stories from '../stories/index';
import FeedForm from '../feed-form/index';
import FeedPost from '../feed-post/FeedPost';


import './header.css';
import '../stories/stories.css'
import { Link, Redirect } from 'react-router-dom';

function Header() {
    const [eventos, setEventos] = useState([]);
    let listEventos = [];

    const dispatch = useDispatch();

    useEffect(() => {
        firebase.firestore().collection('events').get().then(async (result) => {
            await result.docs.forEach(doc => {
                listEventos.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            setEventos(listEventos);
        })
    });

    return (
        <div className="App">
            <div className="header">
                <div className="header__left">
                    <div className="div__logo">
                        <div className="logo__fb">
                            <FaEarlybirds />
                        </div>
                        <div className="search__fb">
                            {/* <form className="search-form" method="post" name="header_search"> */}
                            <div className="relative white div__input">
                                <input type="search" name="header_search_query" placeholder="Pesquisar" class="input-reset color-inherit input-focus all-animate br-pill ph4 sans-serif fw6 header-search-input ba bw1 bg-white-10 b--transparent" />
                            </div>
                            {/* </form> */}
                        </div>
                    </div>
                    <div className="div__content_header">
                        <div className="home__fb">
                            <FaHome />
                            <span>Início</span>
                        </div>
                        <div className="friend__fb">
                            <FaUserFriends />
                            <span>Rede</span>
                        </div>
                        <div className="group__fb">
                            <MdOutlineGroups />
                            <span>Amigos</span>
                        </div>
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
                    {useSelector(state => state.loggedUSer) == 0 ? <Redirect to='/' /> : null}
                    <div className="div__plus_btn">
                        <span onClick={() => dispatch({ type: 'LOG_OUT' })}>Sair</span>
                    </div>
                </div>
            </div>
            {/* <Stories /> */}
            <main className='feed_content'>
                <FeedForm />
                {eventos.map(item => <FeedPost key={item.id} id={item.id} img={item.photo} title={item.title} nome="Trinta Reis" horario={item.hour} conteudo={item.details} />)}
            </main>
        </div>
    )
}

export default Header;