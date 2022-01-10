import React, { useState, useEffect } from 'react';
import { FaHome, FaRocketchat, FaEarlybirds, FaUserFriends, FaUniversity, FaSearch } from "react-icons/fa";
import { IoIosNotifications, IoIosSchool } from "react-icons/io";
import { MdOutlineGroups } from "react-icons/md";
import firebase from '../../config/firebase';


import Stories from '../stories/index';
import FeedForm from '../feed-form/index';
import FeedPost from '../feed-post/FeedPost';


import './header.css';
import '../stories/stories.css'
import { Link } from 'react-router-dom';

function Header() {
    const [eventos, setEventos] = useState([]);
    let listEventos = [];

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
                <div className="headerLeft">
                    <div className="logo-fb">
                        <FaEarlybirds />
                    </div>
                    <div className="search-fb">
                        <form className="search-form" method="post" name="header_search">
                            <div class="relative white">
                                <input type="search" name="header_search_query" placeholder="Pesquisar" class="input-reset color-inherit input-focus all-animate br-pill ph4 sans-serif fw6 header-search-input ba bw1 bg-white-10 b--transparent" />
                            </div>
                        </form>
                    </div>
                    <div className="home-fb">
                        <FaHome />
                        <label>Início</label>
                    </div>
                    <div className="friend-fb">
                        <FaUserFriends />
                        <label>Rede</label>
                    </div>
                    <div className="chat-fb">
                        <FaRocketchat />
                        <label>Chat</label>
                    </div>
                    <div className="university-fb">
                        <FaUniversity />
                        <label>Instituições</label>
                    </div>
                    <div className="notification-fb">
                        <IoIosNotifications />
                        <label>Notificações</label>
                    </div>
                    <div className="school-fb">
                        <IoIosSchool />
                        <label>Cursos</label>
                    </div>
                    <div className="group-fb">
                        <MdOutlineGroups />
                        <label>Amigos</label>
                    </div>
                </div>
                <div className="headerRight">
                    <div className="plus-btn">
                        +
                    </div>
                </div>
            </div>
            {/* <Stories /> */}
            <main className='feed_content'>
                <FeedForm />
                {eventos.map(item => <FeedPost key={item.id} img={item.photo} title={item.title} nome="Trinta Reis" horario={item.hour} conteudo={item.details} />)}
                {/* <FeedPost nome="Trinta Reis" horario="20:00 h" conteudo="Conheça os benéficios da maior rede social vocacional" />
                <FeedPost nome="IFPE" horario="10:00 h" conteudo="Incrições para os cursos de pós-graduação estão ABERTAS!!!" />
                <FeedPost nome="Marcos" horario="13:30 h" conteudo="Galera criando criei um grupo de estudo sobre tecnologias frontend." /> */}
            </main>
        </div>
    )
}

export default Header;