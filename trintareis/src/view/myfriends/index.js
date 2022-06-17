import './myFriends.css';
import React, {useEffect} from 'react';
import { useStateIfMounted } from 'use-state-if-mounted';
import Header from '../../components/header/index';
import FriendCard from '../../components/friend-card';
import firebase from '../../config/firebase';
import { useSelector } from 'react-redux';


export default function MyFriends() {
    
    const [users, setUsers] = useStateIfMounted([]);
    const [loaded, setLoaded] = useStateIfMounted(false);
    const [loadStarted, setLoadStarted] = useStateIfMounted(false);
    const [cardsLoaded, setCardsLoaded] = useStateIfMounted (false);
    const [cardList, setCardList] = useStateIfMounted(<span> </span>);
    const [friends, setFriends] = useStateIfMounted([]);

    const emailUser = useSelector(state => state.emailUser);

    useEffect(()=>{
        let abortController = new AbortController();

        getFriends();
        if (!cardsLoaded){
            mountFriendsCards();
            setCardsLoaded(true);
        }

        return function cleanup() {
            abortController.abort();
        }
    });

    function getFriends(){
        let tempList = [];
        if (!loaded && !loadStarted){
            setLoadStarted(true);
            let idCount = 0; // valor para gerar os IDs dos componentes, necessário para a função map        
            
            console.log("getfriends em execução /connectscreen");
            
            firebase.firestore().collection('profiles').get().then(  
                (result) => {      
                    result.docs.forEach(doc => {
                            if (doc.get("emailUser") === emailUser) {   
                                
                                setFriends(doc.get("friends"));

                                if((idCount+1) == result.docs.length){
                                    console.log("getfriends finalizado /connectscreen");
                                    setLoaded(true);
                                    setUsers(tempList);
                                    setCardsLoaded(false);
                                }
                            } 
                            else {
                                tempList.push({
                                    id: idCount,
                                    nome: doc.get("userName"),
                                    course: doc.get("city"),
                                    type: "aluno",
                                    profilePhoto: doc.get("profilePhoto"),
                                    email: doc.get("emailUser"),
                                    profileId: doc.id
                                });

                                idCount = idCount + 1;

                                if((idCount+1) == result.docs.length){
                                    console.log("getfriends finalizado /connectscreen");
                                    setLoaded(true);
                                    setUsers(tempList);
                                    setCardsLoaded(false);
                                }
                            }
                })}
            );
        }
    }

    function mountFriendsCards(){
        if (friends.length != 0){
            setCardList (
                <span className='cards-display'>
                    {users.map(user => {
                                    if (friends.includes(user.email)){
                                        return (
                                            <FriendCard 
                                                key={user.id}
                                                nome={user.nome}
                                                course={user.course}
                                                type={user.type}
                                                profilePhoto={user.profilePhoto}
                                                email={user.email}
                                                profileId={user.profileId}
                                                isFriend={true} />)}                                        
                                    })}
                </span>
            );
        }
    };

    function unmountFriendsCards(){
        setCardList (<span> </span>);
    }

    return (
        <div className="App">
            <div onClick={unmountFriendsCards} ><Header/></div>
                <div className="div__main_myfriends">
                    <div className="div__title_myfriends">
                        <span>Meus amigos</span>
                    </div>
                    
                    <section className="section_friends_list" id="sec-bd5e">
                        {cardList}
                    </section>
                </div>
        </div>
    )

};

/* métodos auxiliares pra debug
      function printUsers(){
        console.log('');
        console.log(users.length);
        for (var i = 0; i < users.length; i++){
            console.log(users[i]);
        }
    }

    <div>
                        <button onClick={mountFriendsCards}> mount content </button>
                    </div>
*/