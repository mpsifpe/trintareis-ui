import React from 'react';
import { FaHome, FaRocketchat, FaEarlybirds, FaUserFriends, FaUniversity, FaSearch, FaPlus } from "react-icons/fa";
import { IoIosNotifications, IoIosSchool } from "react-icons/io";
import { MdOutlineGroups } from "react-icons/md";

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
        </div>
    )
}

export default Header;