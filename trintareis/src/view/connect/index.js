import './connect.css';
import React, {useEffect} from 'react';
import { useStateIfMounted } from 'use-state-if-mounted';
import Header from '../../components/header/index';
import FriendCard from '../../components/friend-card';
import firebase from '../../config/firebase';
import { useSelector } from 'react-redux';


export default function ConnectScreen(props) {
    
    const [users, setUsers] = useStateIfMounted([]);
    const [loaded, setLoaded] = useStateIfMounted(false);
    const [loadStarted, setLoadStarted] = useStateIfMounted(false);
    const [cardsLoaded, setCardsLoaded] = useStateIfMounted (false);
    const [cardList, setCardList] = useStateIfMounted(<span> </span>);

    const emailUser = useSelector(state => state.emailUser);
    
    var friendsList = [];
    let data = [];

    async function fetch() {    
        let friendsLoaded = false;

        const profilesCollection = firebase.firestore().collection('profiles');
        const friendsCollection = firebase.firestore().collection('friends');

        //carrega a lista de amigos do usuário logado e coloca na friendsList junto com o email do mesmo, pra facilitar o get
        if(friendsLoaded === false){ 
            friendsCollection.get().then((friends) => {
                
                let friendsCount = friends.size;
                friendsList.push(emailUser);

                friends.forEach((frnd) => {
                        if(friendsCount >=0 ){    
                            friendsCount = friendsCount-1;
                            if (frnd.data().friend1 === emailUser ){
                                friendsList.push(frnd.data().friend2); }

                            if (frnd.data().friend2 === emailUser){
                                friendsList.push(frnd.data().friend1); }
                        }
                    });
                    
                    friendsLoaded = true;

                    //carrega os dados dos profiles de todos os usuarios que não estejam na friendsList
                    if (!loaded && !loadStarted && friendsLoaded){
                        let idCount = 0;
                        setLoadStarted(true);
                        console.log("fetch em execução /contactsscreen");
            
                        profilesCollection.where('emailUser', 'not-in', friendsList).get().then((result) => {
                            result.forEach((prfl) => {
                                data.push({
                                    id: idCount,
                                    nome: prfl.data().userName,
                                    course: prfl.data().city,
                                    type: "aluno",
                                    profilePhoto: prfl.data().profilePhoto,
                                    email: prfl.data().emailUser,
                                    profileId: prfl.data().id
                                });
                                idCount = idCount + 1;
                                
                                if((idCount+1) > result.docs.length || result.docs.length === 1){
                                    console.log("fetch finalizado /contactsscreen");
                                    setLoaded(true);
                                    setUsers(data);
                                    setCardsLoaded(false);
                                }
                            });
                        });
                    }
                });
            
        }
        
        
    };


    useEffect(()=>{
        let abortController = new AbortController();

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
                {users.map(user => ( 
                                    <FriendCard 
                                        key={user.id}
                                        nome={user.nome}
                                        course={user.course}
                                        type={user.type}
                                        profilePhoto={user.profilePhoto}
                                        email={user.email}
                                        profileId={user.profileId}
                                        isFriend={false} />
                ))}
            </span>
        );
    };

    function unmountFriendsCards(){
        setCardList (<span> </span>);
    }

    return (
        <div className="App">
            <div onClick={unmountFriendsCards} ><Header/></div>
                <div className="div__main_myfriends">
                    <div className="div__title_myfriends">
                        <span>Conecte-se</span>
                    </div>
                    
                    <section className="section_friends_list" id="sec-bd5e">
                        {cardList}
                    </section>
                </div>
        </div>
    )

};