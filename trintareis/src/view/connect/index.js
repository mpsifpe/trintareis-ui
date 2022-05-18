import './connect.css';
import React from 'react';
import { useStateIfMounted } from 'use-state-if-mounted';
import Header from '../../components/header/index';
import FriendCard from '../../components/friend-card';
import firebase from '../../config/firebase';



export default function ConnectScreen() {
    
    const [users, setUsers] = useStateIfMounted([]);
    const [loaded, setLoaded] = useStateIfMounted(false);
    const [cardList, setCardList] = useStateIfMounted(<span> </span>)

    function getFriends(){
        let tempList = [];
        if (!loaded){
            let idCount = 0; // valor para gerar os IDs dos componentes, necessário para a função map        
            
            console.log("getfriends em execução");
            
            firebase.firestore().collection('profiles').get().then(  
                (result) => {      
                    result.docs.forEach(doc => {    
                                            tempList.push({
                                                        id: idCount,
                                                        nome: doc.get("userName"),
                                                        course: doc.get("city"),
                                                        type: "aluno"
                                                    });                                            
                                            idCount = idCount + 1;                                                                                                 
                                        
                                            if((idCount+1) == result.docs.length){
                                                console.log("getfriends finalizado");
                                                setLoaded(true);
                                                setUsers(tempList);
                                            }
                })}
            );
        }
    }

    function mountFriendsCards(){
        setCardList (
           <span>
                {users.map(user => ( 
                                    <FriendCard 
                                        key={user.id}
                                        nome={user.nome}
                                        course={user.course}
                                        type={user.type} />
                ))}
            </span>
        );
    }


    /*execução--------------------------------------------------------------------------------------*/
    getFriends()

    return (
        <div className="App">
            <Header />
                <div className="div__main_myfriends">
                    <div className="div__title_myfriends" onClick={mountFriendsCards}>
                        <span>Conecte-se</span>
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