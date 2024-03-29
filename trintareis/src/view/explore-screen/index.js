import './explore-screen.css';
import React, {useEffect, useContext, useState} from 'react';
import Header from '../../components/header/index';
import FriendCard from '../../components/friend-card';
import { useSelector } from 'react-redux';
import api from '../../config/api';
import NotyfContext from '../../components/notyf-toast/NotyfContext';
import { useLocation, Redirect } from 'react-router-dom';


export default function ExploreScreen() {
    
    const [personList, setPersonList] = useState(<span> </span>);
    const [instList, setInstList] = useState(<span> </span>);
    const [redirect, setRedirect] = useState(<></>);
    
    const emailUser = useSelector(state => state.emailUser);
    const notyf = useContext(NotyfContext);
    let location = useLocation();

    useEffect(()=>{
        let abortController = new AbortController();

        api.get('/friends/has-not-connection',{
            params : {
                userEmail: emailUser,
                page: 0,
                size: 20
            }
        })
        .then(function (response) {
            console.log(response.data.content)
            setPersonList (   
                <span className='cards-display'>
                {
                    response.data.content.map((profile, i) => 
                        <FriendCard 
                            key = {i}
                            idConnection = {""}
                            nome = {profile.userName}
                            profilePhoto = {profile.profilePhoto}
                            email = {profile.userEmail}
                            profileId = {profile.id}
                            profileInfo = {profile.profileInformation}
                            details = {profile.details}
                            isFriend = {false}
                            city = {profile.city}
                            inviter = {false}
                            profileType = "PERSONAL"
                        /> 
                    )
                }
                </span>
            )
        })
        .catch(function (error) {
            console.log(error);
            notyf.error("Desculpe, ocorreu um erro")
            setRedirect(<Redirect to={{ pathname: '/home', state: { firstLogin: location.state.firstLogin, profilePhoto: location.state.profilePhoto, coverPhoto: location.state.coverPhoto, userData: location.state.userData } }}/>)
        })

        //api.get('/profile/get-by-profile-type?profileType=PERSONAL')
        

        api.get('/profile/get-by-profile-type?profileType=INSTITUTIONAL')
        .then(function (response) {
            setInstList (   
                <span className='cards-display'>
                {
                    response.data.map((institution, i) => 
                        <FriendCard 
                            key={i}
                            idConnection={""}
                            nome={institution.userName}
                            profilePhoto={institution.profilePhoto}
                            email={institution.userEmail}
                            profileId={institution.id}
                            profileInfo = {institution.profileInformation}
                            details = {institution.details}
                            isFriend={false}
                            city={institution.city}
                            inviter={false}
                            profileType = "INSTITUTIONAL"
                        /> 
                    )
                }
                </span>
            );
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
            <Header firstLogin={location.state.firstLogin} profilePhoto={location.state.profilePhoto} coverPhoto={location.state.coverPhoto} userData={location.state.userData} origin="explore-screen"/>
                <div className="div__main_explore">
                    <div className="div__title_explore">
                        <span style={{fontWeight:"600"}}>Explorar</span><br/>
                        <span>Pessoas</span>
                    </div>
                    
                    <section className="section_cards_list" id="sec-bd5e">
                        {personList}
                    </section>

                    <div className="div__title_explore">
                        <span>Instituições</span>
                    </div>

                    <section className="section_cards_list" id="sec-bd5e">
                        {instList}
                    </section>
                </div>
        </div>
    )

};