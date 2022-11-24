import './explore-screen.css';
import React, {useEffect, useContext, useState} from 'react';
import Header from '../../components/header/index';
import FriendCard from '../../components/friend-card';
import { useSelector } from 'react-redux';
import api from '../../config/api';
import NotyfContext from '../../components/notyf-toast/NotyfContext';
import { useLocation, Redirect } from 'react-router-dom';


export default function ExploreScreen(props) {
    
    const [cardList, setCardList] = useState(<span> </span>);
    const [redirect, setRedirect] = useState(<></>);
    
    const emailUser = useSelector(state => state.emailUser);
    const notyf = useContext(NotyfContext);
    let location = useLocation();

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
            console.log(response)
            setCardList (   
                <span className='cards-display'>
                    {response.data.content.map((u, i) => (
                                    <FriendCard 
                                        key={i}
                                        idConnection={""}
                                        nome={u.userName}
                                        profilePhoto={u.profilePhoto}
                                        email={u.emailUser}
                                        profileId={u.id}
                                        isFriend={false}
                                        city={u.city}
                                        inviter={false}
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
            <Header firstLogin={location.state.firstLogin} profilePhoto={location.state.profilePhoto} coverPhoto={location.state.coverPhoto} userData={location.state.userData}/>
                <div className="div__main_explore">
                    <div className="div__title_explore">
                        <span>Explorar</span>
                    </div>
                    
                    <section className="section_cards_list" id="sec-bd5e">
                        {cardList}
                    </section>
                </div>
        </div>
    )

};