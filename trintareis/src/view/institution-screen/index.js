import './institution-screen.css';
import React, {useEffect, useState} from 'react';
import { useLocation, useParams } from 'react-router-dom';

import api from '../../config/api';
import Header from '../../components/header/index';
import CourseCard from '../../components/course-card';

export default function InstitutionScreen() {
    
    let location = useLocation();
    let params = useParams();

    const [name, setName] = useState("");
    const [info, setInfo] = useState("");
    const [courseData, setCourseData] = useState([]);
    const [customData, setCustomData] = useState([]);
    const [customizations, setCustomizations] = useState(<></>);
    const [loaded, setLoaded] = useState(false);
    const [ready, setReady] = useState(false);
    const [update, setUpdate] = useState(false);

    useEffect(()=>{
        let abortController = new AbortController();
        
        if(!loaded){
            fetch();
        } else {
            if(!ready){
                new Promise( (resolve, reject) => {
                    try{
                        console.log("course" , courseData)
                        console.log("custom" , customData)
                        setCustomizations(
                            customData.map(custom =>
                                <div className='course_div'>
                                    <CourseCard 
                                        key={custom.id}
                                        id={custom.id}
                                        title={courseData[custom.courseId]}
                                        description={custom.courseDescriptionCustomization}
                                        stateFirstLogin={location.state.firstLogin}
                                        stateProfilePhoto={location.state.profilePhoto} 
                                        stateCoverPhoto={location.state.coverPhoto} 
                                        stateUserData={location.state.userData}
                                        customLink={custom.descriptionLink}
                                        type="custom"
                                    />
                                </div>
                            )
                        )
                        resolve("Promise resolved successfully");
                    } catch{
                        reject(Error("Promise rejected"));
                    }
                       
                }).then(()=>{setReady(true)})
            }
        }

        return function cleanup() {
            abortController.abort();
        }  
    },[update]);

    return (
        <div className="App">
            <Header firstLogin={location.state.firstLogin} profilePhoto={location.state.profilePhoto} coverPhoto={location.state.coverPhoto} userData={location.state.userData} origin="careerDetail"/>
                <div className="div__main_courseDetail">
                    <div className="div__title_courseDetail">
                        <span>{name}</span>
                    </div>
                    
                    <span className='note'>{info}</span>
                    <section className="section_courseDetail_list" id="sec-bd5e"> 
                        {(ready === true) && customizations}
                    </section>
                </div>
        </div>
    )

    function fetch(){
        
        api.get('/profile/get-by-id/'+ params.id)
        .then( profiles => { 
            setName(profiles.data.userName);
            setInfo(profiles.data.profileInformation);
         })
        .catch( error  => { console.log(error) })
        .finally(()=>{
            api.get('/course')
            .then( courses => {
                let list = {};
                
                for (let i = 0; i < courses.data.length; i++){
                    list[courses.data[i].id] = courses.data[i].title;
                    if (i === (courses.data.length - 1)){
                        setCourseData(list) 
                        console.log(list)
                    }
                }
            })
            .catch( error  => { console.log(error) })
            .finally(()=>{
                api.get('/customization/get-all-customization?institutionId=' + params.id)
                .then( custom => { setCustomData(custom.data) })
                .catch( error => { console.log(error) })
                .finally(()=>{
                    setLoaded(true);
                    setUpdate(!update);
                })           
            })
        })
    }    
}