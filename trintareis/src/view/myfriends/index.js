import React, { useState } from 'react';
import './recoveryPassword.css';
import './myfriends.css';
import './nicepage.css';


import { FaHome, FaRocketchat, FaEarlybirds, FaUserFriends, FaUniversity, FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { IoIosNotifications, IoIosSchool } from "react-icons/io";
import { MdOutlineGroups } from "react-icons/md";


function MyFriends() {


    function myFriends() {

        //  setMsg('Verique se o email é válido!')

    }

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








            <section class="u-align-center u-clearfix u-grey-10 u-section-2" id="sec-bd5e">
                    
                    <div class="u-expanded-width-sm u-expanded-width-xs u-list u-list-1">
                        <div class="u-repeater u-repeater-1 ">
                        



                        <div  class="box shadow-interpolacao u-align-center u-container-style u-list-item u-repeater-item u-white u-list-item-3">
                                <div class="u-container-layout u-similar-container u-container-layout-3">
                                    <div alt="" class="u-border-13 u-border-palette-2-base u-image u-image-circle u-image-3" data-image-width="598" data-image-height="598"></div>
                                    <h4 class="u-text u-text-default u-text-6">Roberto Carlos</h4>
                                    <p class="u-text u-text-7"> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
                                    <a href="" class="botao">Conectar</a>
                                </div>
                            </div>

                            <div  class="box shadow-interpolacao u-align-center u-container-style u-list-item u-repeater-item u-white u-list-item-3">
                                <div class="u-container-layout u-similar-container u-container-layout-3">
                                    <div alt="" class="u-border-13 u-border-palette-2-base u-image u-image-circle u-image-3" data-image-width="598" data-image-height="598"></div>
                                    <h4 class="u-text u-text-default u-text-6">Julio Cesar</h4>
                                    <p class="u-text u-text-7"> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
                                    <a href="" class="botao">Conectar</a>
                                </div>
                            </div>

                            <div  class="box shadow-interpolacao u-align-center u-container-style u-list-item u-repeater-item u-white u-list-item-3">
                                <div class="u-container-layout u-similar-container u-container-layout-3">
                                    <div alt="" class="u-border-13 u-border-palette-2-base u-image u-image-circle u-image-3" data-image-width="598" data-image-height="598"></div>
                                    <h4 class="u-text u-text-default u-text-6">Roberto Carlos</h4>
                                    <p class="u-text u-text-7"> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
                                    <a href="" class="botao">Conectar</a>
                                </div>
                            </div>









                        </div>
                    </div>
            </section>






























        </div>





    )
}

export default MyFriends;