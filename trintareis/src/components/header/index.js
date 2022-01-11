import React from 'react';
import { FaHome, FaRocketchat, FaEarlybirds, FaUserFriends, FaUniversity, FaSearch } from "react-icons/fa";
import { IoIosNotifications, IoIosSchool } from "react-icons/io";
import { MdOutlineGroups } from "react-icons/md";


import Stories from '../stories/index';
import FeedForm from '../feed-form/index';
import FeedPost from '../feed-post/FeedPost';


import './header.css';
import '../stories/stories.css'
import { Link } from 'react-router-dom';

function Header() {
    return (
        <div className="App">
            <div className="header">
                <div className="headerLeft">
                    <div className="logo-fb">
                        <FaEarlybirds />
                    </div>
                    <div className="search-fb">
                        <FaSearch />
                    </div>
                    <div className="home-fb">
                        <FaHome />
                    </div>
                    <Link to="/myfriends">
                        <div className="friend-fb">
                            <FaUserFriends />
                        </div>
                    </Link>
                    <div className="chat-fb">
                        <FaRocketchat />
                    </div>
                    <div className="university-fb">
                        <FaUniversity />
                    </div>
                    <div className="notification-fb">
                        <IoIosNotifications />
                    </div>
                    <div className="school-fb">
                        <IoIosSchool />
                    </div>
                    <div className="group-fb">
                        <MdOutlineGroups />
                    </div>
                </div>
                <div className="headerRight">
                    <div className="plus-btn">
                        +
                    </div>
                </div>
            </div>
            {/* <Stories /> */}
            <FeedForm />
            <FeedPost nome="Trinta Reis" horario="20:00 h" conteudo="Conheça os benéficios da maior rede social vocacional" />
            <FeedPost nome="IFPE" horario="10:00 h" conteudo="Incrições para os cursos de pós-graduação estão ABERTAS!!!" />
            <FeedPost nome="Marcos" horario="13:30 h" conteudo="Galera criando criei um grupo de estudo sobre tecnologias frontend." />
        </div>
    )
}

export default Header;