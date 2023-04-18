import './career.css';
import React, {useEffect, useContext, useState} from 'react';
import { useLocation, Redirect } from 'react-router-dom';

import api from '../../config/api';
import Header from '../../components/header/index';
import CourseCard from '../../components/course-card';
import NotyfContext from '../../components/notyf-toast/NotyfContext';

export default function Career() {

    const notyf = useContext(NotyfContext);
    const [cardList, setCardList] = useState(<span> </span>);
    const [redirect, setRedirect] = useState(<></>);

    let location = useLocation();

    useEffect(()=>{
        let abortController = new AbortController();

        api.get('/course')
        .then((response) => {
            setCardList(
                response.data.map((course, index) => (
                    <CourseCard 
                        key={index}
                        id={course.id}
                        title={course.title}
                        description={course.description}
                        stateFirstLogin={location.state.firstLogin}
                        stateProfilePhoto={location.state.profilePhoto} 
                        stateCoverPhoto={location.state.coverPhoto} 
                        stateUserData={location.state.userData}
                    />
                ))
            )
        })
        .catch((error)=>{
            console.log(error);
            notyf.error("Desculpe, ocorreu um erro")
            setRedirect(<Redirect to={{ pathname: '/home', state: { firstLogin: location.state.firstLogin, profilePhoto: location.state.profilePhoto, coverPhoto: location.state.coverPhoto, userData: location.state.userData , origin: "career-error"}}}/>)
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