import './explore-screen.css';
import React, {useEffect, useContext, useState} from 'react';
import Header from '../../components/header/index';
import FriendCard from '../../components/friend-card';
import CourseCard from '../../components/course-card';
import { useSelector } from 'react-redux';
import api from '../../config/api';
import NotyfContext from '../../components/notyf-toast/NotyfContext';
import { useLocation, Redirect } from 'react-router-dom';
import { abstractsData } from './dummyData.ts';


export default function ExploreScreen() {
    
    const [personList, setPersonList] = useState(<span> </span>);
    const [courseList, setCourseList] = useState(<span> </span>);
    const [redirect, setRedirect] = useState(<></>);
    
    const emailUser = useSelector(state => state.emailUser);
    const notyf = useContext(NotyfContext);
    let location = useLocation();
    //let abstracts = require('./abstracts.json')

    useEffect(()=>{
        let abortController = new AbortController();

        api.get('/friends/has-not-connection', {
            params : {
                userEmail: emailUser,
                page: 0,
                size: 10
            }
        })
        .then(function (response) {
            //console.log(response.data.content)
            setPersonList (  
                <div>
                    <span className='cards-display'>
                        {response.data.content.map((u, i) => (
                                        <FriendCard 
                                            key={i}
                                            idConnection={""}
                                            nome={u.userName}
                                            profilePhoto={u.profilePhoto}
                                            email={u.userEmail}
                                            profileId={u.id}
                                            isFriend={false}
                                            city={u.city}
                                            inviter={false}
                                        /> 
                        ))}
                    </span>
                </div>
            );
        })
        .catch(function (error) {
            console.log(error);
            notyf.error("Desculpe, ocorreu um erro")
            setRedirect(<Redirect to={{ pathname: '/home', state: { firstLogin: location.state.firstLogin, profilePhoto: location.state.profilePhoto, coverPhoto: location.state.coverPhoto, userData: location.state.userData } }}/>)
        }).finally(()=>{
            setCourseList(
                    <span className='cards-display'>
                    {abstractsData.map((u, i) => (
                                        <CourseCard 
                                            key={i}
                                            courseID={u.id}
                                            title={u.title}
                                            description={u.description}
                                            level={u.level}
                                            type={u.type}
                                        /> 
                        ))}
                    </span>
            )
            
        })

        
        return function cleanup() {
            abortController.abort();
        }

    },[]);

    return (
        <div className="App">
            {redirect}
            <Header firstLogin={location.state.firstLogin} profilePhoto={location.state.profilePhoto} coverPhoto={location.state.coverPhoto} userData={location.state.userData}/>
                <div className="div__main_explore">
                    
                    <section className="section_cards_list" id="sec-bd5e">
                        <div className="div__title_category">
                            <span>Pessoas</span>
                        </div>
                        {personList}
                    </section>
                    <section className="section_cards_list" id="sec-bd5e">
                        <div className="div__title_category">
                            <span>Cursos</span>
                        </div>  
                        {courseList}
                    </section>
                </div>
        </div>
    )

};

/*
var CourseAbstracts = [
    {    
    },
    {
        
    }
]

var Courses = [
    {
        
    },
    {
        
    },
    {
        
    }
]
*/