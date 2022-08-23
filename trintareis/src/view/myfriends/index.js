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
    const [friendsCount, setFriendsCount] = useStateIfMounted(0);

    const emailUser = useSelector(state => state.emailUser);

    var friendsList = [];

    useEffect(()=>{
        let abortController = new AbortController();
        let data = [];

        async function fetch() {    
            const friendsCollection = firebase.firestore().collection('friends');
            const profilesCollection = firebase.firestore().collection('profiles');

            if (!loaded && !loadStarted){
                let idCount = 0;
                setLoadStarted(true);
                console.log("fetch em execução /friendsscreen");

                //carrega 
                friendsCollection.get().then((friends) => {
                    friends.forEach((frnd) => {
                        if (frnd.data().friend1 === emailUser){
                            profilesCollection.where('emailUser', '==', frnd.data().friend2).get().then((result) => {
                                result.forEach((prfl) => {
                                    data.push({
                                        id: idCount,
                                        nome: prfl.data().userName,
                                        course: prfl.data().city,
                                        type: "aluno",
                                        profilePhoto: prfl.data().profilePhoto,
                                        email: prfl.data().emailUser,
                                        profileId: prfl.data().id,
                                        pending: frnd.data().pending
                                    });
                                    idCount = idCount + 1;
                                    
                                    if((idCount+1) > result.docs.length || friends.docs.length === 1){
                                        console.log("fetch finalizado /friendsscreen");
                                        setLoaded(true);
                                        setUsers(data);
                                        setCardsLoaded(false);
                                    }
                                });
                            });
                            friendsList.push(frnd.data().friend2);
                        }

                        if (frnd.data().friend2 === emailUser){
                            profilesCollection.where('emailUser', '==', frnd.data().friend1).get().then((result) => {
                                result.forEach((prfl) => {
                                    data.push({
                                        id: idCount,
                                        nome: prfl.data().userName,
                                        course: prfl.data().city,
                                        type: "aluno",
                                        profilePhoto: prfl.data().profilePhoto,
                                        email: prfl.data().emailUser,
                                        profileId: prfl.data().id,
                                        pending: frnd.data().pending
                                    });
                                    idCount = idCount + 1;
                                    
                                    if((idCount+1) > result.docs.length || friends.docs.length === 1){
                                        console.log("fetch finalizado /friendsscreen");
                                        setLoaded(true);
                                        setUsers(data);
                                        setCardsLoaded(false);
                                    }
                                });
                            });
                            friendsList.push(frnd.data().friend1);
                        }
                    });

                }); 
            }

        }

        fetch().then(() => {
            if (!cardsLoaded){
                mountFriendsCards();
                setCardsLoaded(true);
            }
        });

        return function cleanup() {
            abortController.abort();
        }  
    });

    function mountFriendsCards(){
        setCardList (
            <span className='cards-display'>
                 {users.map(u => ( 
                                     <FriendCard 
                                         key={u.id}
                                         nome={u.nome}
                                         course={u.course}
                                         type={u.type}
                                         profilePhoto={u.profilePhoto}
                                         email={u.email}
                                         profileId={u.profileId}
                                         isFriend={true}
                                         pending={u.pending}
                                         /> 
                 ))}
             </span>
         );
         setFriendsCount(users.length);
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
                        <span>({friendsCount})</span>
                    </div>
                    
                    <section className="section_friends_list" id="sec-bd5e">
                        {cardList}
                    </section>
                </div>
        </div>
    )

};