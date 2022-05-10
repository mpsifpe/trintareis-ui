import './myFriends.css';
import React from 'react';
import Header from '../../components/header/index';
import UserList from '../../components/user-list';

function MyFriends(props) {
       
    return (
        <div className="App">
            <Header />
                <div className="div__main_myfriends">
                    <div className="div__title_myfriends">
                        <span>Meus amigos</span>
                    </div>
                    <section className="section_friends_list" id="sec-bd5e">
                        
                        <UserList/>
                    </section>
                </div>
        </div>
    )
}

export default MyFriends;

//<FriendCard/> <FriendCard/>