import './career-detail-screen.css';
import React, {useEffect, useState} from 'react';
import { useLocation, Link } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";

import api from '../../config/api';
import Header from '../../components/header/index';
import CourseCard from '../../components/course-card';

export default function CareerDetail() {
    
    let location = useLocation();

    const [customData, setCustomData] = useState([]);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [customizations, setCustomizations] = useState(<></>);
    const [instList, setInstList] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [ready, setReady] = useState(false);
    const [update, setUpdate] = useState(false);

    useEffect(()=>{
        let abortController = new AbortController();
        
        if(!loaded){
            setTitle(location.state.courseTitle);
            setDesc(location.state.courseDesc);
            fetch();
        } else {
            if(!ready){
                new Promise( (resolve, reject) => {
                    try{
                        setCustomizations(
                            customData.map(course => {
                                let name = getInstitutionName(course.institutionId)
                                return (
                                <div className='course_div'>
                                    <CourseCard 
                                        key={course.id}
                                        id={course.id}
                                        title={name}
                                        description={course.courseDescriptionCustomization}
                                        stateFirstLogin={location.state.firstLogin}
                                        stateProfilePhoto={location.state.profilePhoto} 
                                        stateCoverPhoto={location.state.coverPhoto} 
                                        stateUserData={location.state.userData}
                                        customLink={course.descriptionLink}
                                        type="custom"
                                    />
                                </div>
                            )})
                        )
                        setReady(true);
                        resolve("Promise resolved successfully");
                    } catch{
                        reject(Error("Promise rejected"));
                    }
                       
                 })
            }
        }

        return function cleanup() {
            abortController.abort();
        }  
    },[update]);

    return (
        <div className="App">
            <Header firstLogin={location.state.firstLogin} profilePhoto={location.state.profilePhoto} coverPhoto={location.state.coverPhoto} userData={location.state.userData} origin="careerDetail"/>
                <div className="div__main_custom">
                    <div className="div__title_custom">
                        <Link to={{pathname: "/career",
                                    state: {
                                        firstLogin: location.state.firstLogin,
                                        profilePhoto: location.state.profilePhoto,
                                        coverPhoto: location.state.coverPhoto,
                                        userData: location.state.userData,
                                        origin: "career-detail"}}}>
                            <div className='chevron'><IoChevronBack/></div>
                        </Link>
                        <span>{title}</span>
                    </div>
                    <span className='note'>{desc}</span>

                    <section className="section_course_list" id="sec-bd5e">
                        {(ready === true) && customizations}
                    </section>
                </div>
        </div>
    )

    function fetch(){

        api.get('/customization/get-by-course-id?courseId=' + location.state.courseID)
        .then( custom => { setCustomData(custom.data) })
        .catch( error => { console.log(error) })
        .finally(()=>{
            api.get('/profile/get-by-profile-type?profileType=INSTITUTIONAL')
            .then( profiles => { 
                setInstList(profiles.data);
            })
            .catch((error) => { console.log(error) })
            . finally(()=>{
                setLoaded(true);
                setUpdate(!update);
            })        
        })
    }    

    function getInstitutionName(id){
        for(let i = 0; i<instList.length; i++){
            if(instList[i].id === id){
                return instList[i].userName
            }
        }
    }

}