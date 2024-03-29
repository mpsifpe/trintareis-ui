import './myFriends.css';
import React, {useEffect, useContext, useState} from 'react';
import Header from '../../components/header/index';
import FriendCard from '../../components/friend-card';
import { useSelector } from 'react-redux';
import api from '../../config/api';
import NotyfContext from '../../components/notyf-toast/NotyfContext';
import { useLocation, Redirect } from 'react-router-dom';


export default function MyFriends() {
    
    const [cardList, setCardList] = useState(<span> </span>);
    const [friendsCount, setFriendsCount] = useState(0);
    const [redirect, setRedirect] = useState(<></>);

    const emailUser = useSelector(state => state.emailUser);
    const notyf = useContext(NotyfContext);

    let location = useLocation();

    useEffect(()=>{
        let abortController = new AbortController();
        
        api.get('/friends/',{
            params : {
                userEmail: emailUser,
                page: 0,
                size: 20
            }
        })
        .then(function (response) {

            setFriendsCount(response.data.content.length);
            setCardList (   
                <span className='cards-display'>
                    {response.data.content.map((profile, i) => (
                        <FriendCard 
                            key = {i}
                            idConnection = {profile.idConnection}
                            nome = {profile.name}
                            profilePhoto = {profile.profilePhoto}
                            email = {profile.emailUser}
                            profileId = {profile.id}
                            isFriend = {true}
                            city = {profile.city}
                            inviter = {profile.inviter}
                            pending = {profile.pending}
                            profileType = "PERSONAL"
                        /> 
                    ))}
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
            <Header firstLogin={location.state.firstLogin} profilePhoto={location.state.profilePhoto} coverPhoto={location.state.coverPhoto} userData={location.state.userData} origin="my-friends-screen"/>
                <div className="div__main_myfriends">
                    <div className="div__title_myfriends">
                        <span>Meus amigos</span>
                        <span> {friendsCount}</span>
                    </div>
                    
                    <section className="section_friends_list" id="sec-bd5e">
                        {cardList}
                    </section>
                </div>
        </div>
    )

};