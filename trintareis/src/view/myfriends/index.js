import './myFriends.css';
import Header from '../../components/header/index';
import FriendCard from '../../components/friend-card';

function MyFriends() {
    return (
        <div className="App">
            <Header />
                <div className="div__main_myfriends">
                    <div className="div__title_myfriends">
                        <span>Meus amigos</span>
                    </div>
                    <section className="section_friends_list" id="sec-bd5e">
                        <FriendCard/>
                        <FriendCard/>
                    </section>
                </div>
        </div>
    )
}

export default MyFriends;