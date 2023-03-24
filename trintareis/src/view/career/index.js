import './career.css';
import React, {useEffect, useContext, useState} from 'react';

import { useSelector } from 'react-redux';
import { useLocation, Redirect } from 'react-router-dom';

import api from '../../config/api';
import Header from '../../components/header/index';
import CourseCard from '../../components/course-card';
import NotyfContext from '../../components/notyf-toast/NotyfContext';

export default function Career() {
    
    const [cardList, setCardList] = useState(<span> </span>);
    const [redirect, setRedirect] = useState(<></>);

    const emailUser = useSelector(state => state.emailUser);
    const notyf = useContext(NotyfContext);

    let location = useLocation();

    useEffect(()=>{
        let abortController = new AbortController();
        
        api.get('/course')
        .then(function (response) {
            console.log(response.data)
            setCardList(
                response.data.map((u, i) => (
                    <CourseCard 
                        key={i}
                        num={i}
                        id={u.id}
                        title={u.title}
                        description={u.description}
                    />
                ))
            )
        })
        .catch(function (error) {
            console.log(error);
            notyf.error("Desculpe, ocorreu um erro")
            setRedirect(<Redirect to={{ pathname: '/home', state: { firstLogin: location.state.firstLogin, profilePhoto: location.state.profilePhoto, coverPhoto: location.state.coverPhoto, userData: location.state.userData } }}/>)
        })
        
        return function cleanup() {
            abortController.abort();
        }  
    },[]);

    return (
        <div className="App">
            {redirect}
            <Header firstLogin={location.state.firstLogin} profilePhoto={location.state.profilePhoto} coverPhoto={location.state.coverPhoto} userData={location.state.userData} origin="career"/>
                <div className="div__main_myfriends">
                    <div className="div__title_myfriends">
                        <span>Carreira</span>
                    </div>
                    
                    <section className="section_friends_list" id="sec-bd5e">
                        {cardList}
                    </section>
                </div>
        </div>
    )

};