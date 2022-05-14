import './myFriends.css';
import React, {useState} from 'react';
import Header from '../../components/header/index';
import FriendCard from '../../components/friend-card';
import firebase from '../../config/firebase';


export default function MyFriends() {
    
    const [users, setUsers] = useState([]);
    let idCount = 0; // valor para gerar os IDs dos componentes, necessário para a função map

    let data = [];
    //carregamento dos dados do Firebase
    firebase.firestore().collection('profiles').get().then(  
        (result) => {
            console.log("começou o processamento");
            result.docs.forEach(doc => {    data.push({ id: idCount,
                                                        nome: doc.get("userName"),
                                                        course: doc.get("city"),
                                                        type: "aluno"});                                            
                                            idCount = idCount + 1;                                            
                                            console.log(data.length);
                                        
                                            if((idCount+1) == result.length){
                                                    result = null;
                                            }
                                        }
                                );
            setUsers(data);
        }
    );

    return (
        <div className="App">
            <Header />
                <div className="div__main_myfriends">
                    <div className="div__title_myfriends">
                        <span>Meus amigos</span>
                    </div>
                    <section className="section_friends_list" id="sec-bd5e">

                    </section>
                </div>
        </div>
    )

};

/*
                        {users.map( user => ( 
                                                <FriendCard 
                                                    key={user.id}
                                                    nome={user.nome}
                                                    course={user.course}
                                                    type={user.type} />
                                            ))
                            }
*/