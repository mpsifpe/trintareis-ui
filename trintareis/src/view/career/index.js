import './career.css';
import React, {useEffect, useContext, useState} from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import api from '../../config/api';
import Header from '../../components/header/index';
import CourseCard from '../../components/course-card';
import NotyfContext from '../../components/notyf-toast/NotyfContext';

export default function Career() {

    const notyf = useContext(NotyfContext);
    const [courseList, setCourseList] = useState([]);
    const [instList, setInstList] = useState([]);
    const [cardList, setCardList] = useState(<span> </span>);
    const [redirect, setRedirect] = useState(<></>);
    const [loaded, setLoaded] = useState(false);

    let location = useLocation();

    useEffect(()=>{
        let abortController = new AbortController();

        if(!loaded){
            fetch();
        }

        return function cleanup() {
            abortController.abort();
        }  
    },[]);

    return (
        <div className="App">
            {redirect}
            <Header firstLogin={location.state.firstLogin} profilePhoto={location.state.profilePhoto} coverPhoto={location.state.coverPhoto} userData={location.state.userData} origin="career"/>
                <div className="div__main_career">
                    <div className="div__title_career">
                        <span>Carreiras</span>
                    </div>

                    <span className='note'>Explore diversas opções de cursos e descubra onde são ofertados </span>
                    <select className="sortSelector" id="sort-selector">
                        <option key={uuidv4()} value="alfabetically">A-Z</option>
                        <option key={uuidv4()} value="alfabeticallyInverse">Z-A</option>
                    </select>
                    <button onClick={sortHandler} className='sortButton'>Ordenar</button>

                    <section className="section_course_list" id="sec-bd5e">
                        {cardList}
                    </section>
                </div>
        </div>
    )

    function fetch(){

        api.get('/course')
        .then((response) => {

            let ordered = response.data.sort((a, b) => {
                let fa = a.title.toLowerCase(),
                    fb = b.title.toLowerCase();
            
                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            })

            setCourseList(ordered);

            setLoaded(true);

            setCardList(
                ordered.map((course) => (
                    <div className='course_div'>
                        <CourseCard 
                            key={uuidv4()}
                            id={course.id}
                            title={course.title}
                            description={course.description}
                            stateFirstLogin={location.state.firstLogin}
                            stateProfilePhoto={location.state.profilePhoto} 
                            stateCoverPhoto={location.state.coverPhoto} 
                            stateUserData={location.state.userData}
                            institutions={instList}
                        />
                    </div>
                ))
            )
        })
        .catch((error)=>{
            console.log(error);
            notyf.error("Desculpe, ocorreu um erro")
            setRedirect(<Redirect to={{ pathname: '/home', state: { firstLogin: location.state.firstLogin, profilePhoto: location.state.profilePhoto, coverPhoto: location.state.coverPhoto, userData: location.state.userData , origin: "career-error"}}}/>)
        })
        //-----------------------------------------------------
        api.get('/profile/get-by-profile-type?profileType=INSTITUTIONAL')
        .then((profiles) => {
            let list = []
            profiles.data.forEach((profile)=>{
                list.push([profile.id, profile.userName])
            });
            setInstList(list);
        })
        .catch((error) => { console.log(error) })
    }

    function sortHandler(){

        let list = courseList;

        switch(document.getElementById('sort-selector').value){

            case "alfabeticallyInverse":
                    list.sort((a, b) => {
                        let fa = a.title.toLowerCase(),
                            fb = b.title.toLowerCase();
                    
                        if (fa > fb) {
                            return -1;
                        }
                        if (fa < fb) {
                            return 1;
                        }
                        return 0;
                    })
                
                    setCardList(
                        list.map((course) => (
                            <div className='course_div'>
                                <CourseCard 
                                    key={uuidv4()}
                                    id={course.id}
                                    title={course.title}
                                    description={course.description}
                                    stateFirstLogin={location.state.firstLogin}
                                    stateProfilePhoto={location.state.profilePhoto} 
                                    stateCoverPhoto={location.state.coverPhoto} 
                                    stateUserData={location.state.userData}
                                />
                            </div>
                        ))
                    )
                break;

            case "alfabetically":
                list.sort((a, b) => {
                    let fa = a.title.toLowerCase(),
                        fb = b.title.toLowerCase();
                
                    if (fa < fb) {
                        return -1;
                    }
                    if (fa > fb) {
                        return 1;
                    }
                    return 0;
                })
            
                setCardList(
                    list.map((course) => (
                        <div className='course_div'>
                            <CourseCard 
                                key={uuidv4()}
                                id={course.id}
                                title={course.title}
                                description={course.description}
                                stateFirstLogin={location.state.firstLogin}
                                stateProfilePhoto={location.state.profilePhoto} 
                                stateCoverPhoto={location.state.coverPhoto} 
                                stateUserData={location.state.userData}
                            />
                        </div>
                    ))
                )
                break;
        }
    }
};