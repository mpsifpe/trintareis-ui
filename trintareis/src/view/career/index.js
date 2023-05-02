import './career.css';
import React, {useEffect, useContext, useState} from 'react';
import { useLocation, Redirect } from 'react-router-dom';

import api from '../../config/api';
import Header from '../../components/header/index';
import CourseCard from '../../components/course-card';
import NotyfContext from '../../components/notyf-toast/NotyfContext';

export default function Career() {

    const notyf = useContext(NotyfContext);
    const [courseList, setCourseList] = useState([]);
    const [cardList, setCardList] = useState(<div> </div>);
    const [redirect, setRedirect] = useState(<></>);
    const [loaded, setLoaded] = useState(false);
    const [update, setUpdate] = useState(false);

    let location = useLocation();

    useEffect(()=>{
        let abortController = new AbortController();

        if(!loaded){
            fetch();
        } else {
            setCardList(<div> </div>);
            setCardList(
                courseList.map(course => (
                    <div className='course_div'>
                        <CourseCard 
                            key={course.id}
                            id={course.id}
                            title={course.title}
                            description={course.description}
                            stateFirstLogin={location.state.firstLogin}
                            stateProfilePhoto={location.state.profilePhoto} 
                            stateCoverPhoto={location.state.coverPhoto} 
                            stateUserData={location.state.userData}
                            type="course"
                        />
                    </div>
                ))
            )
        }

        return function cleanup() {
            abortController.abort();
        }  
    },[update]);

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
                        <option key='az' onClick={()=>{sortHandler("alfabetically")}} value="alfabetically">A-Z</option>
                        <option key='za' onClick={()=>{sortHandler("alfabeticallyInverse")}} value="alfabeticallyInverse">Z-A</option>
                    </select>

                    <section className="section_course_list" id="sec-bd5e">
                        {cardList}
                    </section>
                </div>
        </div>
    )

    function fetch(){
        //------------------ fetch cursos -----------------------
        api.get('/course')
        .then((response) => {

            setCourseList(
                response.data.sort((a, b) => {
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
            )
            setLoaded(true);
            setUpdate(!update);
        })
        .catch((error)=>{
            console.log(error);
            notyf.error("Desculpe, ocorreu um erro")
            setRedirect(<Redirect to={{ pathname: '/home', state: { firstLogin: location.state.firstLogin, profilePhoto: location.state.profilePhoto, coverPhoto: location.state.coverPhoto, userData: location.state.userData , origin: "career-error"}}}/>)
        })
    }

    function sortHandler(s){
        let list = courseList;
        switch(s){
            case "alfabeticallyInverse":
                setCourseList(
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
                );
                setUpdate(!update);
                break;

            case "alfabetically":
                setCourseList(
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
                );
                setUpdate(!update);
                break;
        }
    }
};