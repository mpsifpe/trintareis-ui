import './career-detail-screen.css';
import React, {useEffect, useContext, useState} from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import { delay, isEmpty } from '../../helpers/helper';

import api from '../../config/api';
import Header from '../../components/header/index';
import NotyfContext from '../../components/notyf-toast/NotyfContext';

export default function CareerDetail() {
    
    let location = useLocation();
    const notyf = useContext(NotyfContext);

    const [customData, setCustomData] = useState([]);
    const [redirect, setRedirect] = useState(<></>);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [customizations, setCustomizations] = useState(<></>);
    const [instList, setInstList] = useState([]);
    const [loaded, setLoaded] = useState(false);

    let institutions = {};

    useEffect(()=>{
        let abortController = new AbortController();
        
        setTitle(location.state.courseTitle)
        setDesc(location.state.courseDesc)
        setInstList(location.state.institutions)
        
        if(!loaded){
            fetch();
        }

        //parei aqui
        if(!isEmpty(customData) && !isEmpty(institutions)){            //--------------
            customData.forEach((course, index) => <p key={index}>{institutions[course.id]} - {course.descriptionLink}</p> )
        }



        return function cleanup() {
            abortController.abort();
        }  
    },[loaded]);

    function fetch(){
        api.get('/customization/get-by-course-id?courseId=' + location.state.courseID)
        .then( custom => {
            console.log(custom);
            setCustomData(custom.data);
        })
        .catch( error => {
            console.log(error);
        }).finally(()=>{
            console.log("fetch ", customData);
        })

        /*
        api.get('/profile/get-by-id/' + props.institutionId)
        .then((profile)=>{
            console.log(profile);
            institution[profile.id] = profile.userName;
            setLoaded(true);
        })
        */
    }

    function mountList(data){
        setCustomizations(
            data.map( (course, index) => <p key={index}>{institutions[course.id]} - {course.descriptionLink}</p> )
        )
    }

    return (
        <div className="App">
            {redirect}
            <Header firstLogin={location.state.firstLogin} profilePhoto={location.state.profilePhoto} coverPhoto={location.state.coverPhoto} userData={location.state.userData} origin="careerDetail"/>
                <div className="div__main_courseDetail">
                    <div className="div__title_courseDetail">
                        <span>{title}</span>
                    </div>
                    
                    <section className="section_friends_list" id="sec-bd5e">
                        <span className='desc'>{desc}</span>
                        {customizations}
                    </section>
                </div>
        </div>
    )

};