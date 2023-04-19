import './career-detail-screen.css';
import React, {useEffect, useContext, useState} from 'react';
import { useLocation, Redirect } from 'react-router-dom';

import api from '../../config/api';
import Header from '../../components/header/index';
import NotyfContext from '../../components/notyf-toast/NotyfContext';

export default function CareerDetail() {
    
    let location = useLocation();
    const notyf = useContext(NotyfContext);

    const [data, setData] = useState([]);
    const [redirect, setRedirect] = useState(<></>);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [customizations, setCustomizations] = useState(<></>);
    const [visible, setVisible] = useState(false);

    useEffect(()=>{
        let abortController = new AbortController();
        
        setTitle(location.state.courseTitle)
        setDesc(location.state.courseDesc)

        api.get('/customization/get-by-course-id?courseId=' + location.state.courseID)
        .then((response)=>{
            let institutions = Object.entries(response.data);
            console.log(institutions)
        })
        .catch(()=>{
            notyf.error("Desculpe, ocorreu um erro")
            setRedirect(<Redirect to={{ pathname: '/career', state: { firstLogin: location.state.firstLogin, profilePhoto: location.state.profilePhoto, coverPhoto: location.state.coverPhoto, userData: location.state.userData, origin: "course-error" } }}/>)
        })
        
        return function cleanup() {
            abortController.abort();
        }  
    },[]);

    function mountList(){
        setCustomizations(
            <ul>
            {
                data.map((course, index) => (
                    <li key={index}>{course.descriptionLink}</li> 
                ))
            }
            </ul>
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
                        {desc}
                        <ul>
                            {visible && customizations}
                        </ul>
                    </section>
                </div>
        </div>
    )

};