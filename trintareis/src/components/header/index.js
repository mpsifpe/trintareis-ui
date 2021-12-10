import React from 'react';
import { FaHome, FaRocketchat, FaEarlybirds, FaUserFriends, FaUniversity, FaSearch } from "react-icons/fa";
import { IoIosNotifications, IoIosSchool } from "react-icons/io";
import { MdOutlineGroups } from "react-icons/md";
import { AiFillVideoCamera, AiFillPicture } from "react-icons/ai";
import { BsCalendarDate } from "react-icons/bs";

import Stories from '../../components/stories/index';
import minios_bg from '../../resources/minios.jpg';

import './header.css';
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
                    <div className="friend-fb">
                        <FaUserFriends />
                    </div>
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

            {/* <Stories/> */}

            <div className="feed">
                <div className="feedForm">
                    <img src={minios_bg} />
                    <input type="text" placeholder="Começar Publicar" />

                    <div className="feedIcons">
                        <div className="iconSingle img">
                            <AiFillPicture />
                            <span>Foto</span>
                        </div>
                        <div className="iconSingle">
                            <AiFillVideoCamera />
                            <span>Vídeo</span>
                        </div>
                        <div className="iconSingle evn">
                            <BsCalendarDate />
                            <span>Evento</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="feedPost">
                    <div className="feedPostSingle">
                        <div className="feedPost__profile">
                            <img src={minios_bg} />
                            <h3>TrintaReis<br/><span>20:00</span></h3>
                        </div>
                        <div className="feedPost__content">
                            <p>Fazer parte do Trinta Reis significa ser do time vencedor!!</p>
                            <img src="https://pbs.twimg.com/media/EKkDakiXsAECxgW.jpg" />
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default Header;