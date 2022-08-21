import './friend-card.css';
import React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useStateIfMounted } from 'use-state-if-mounted';
import loading from '../../resources/loading.gif';
import firebase from '../../config/firebase';


export default function FriendCard(props) {

    const [name, setName] = useStateIfMounted("empty");
    const [course, setCourse] = useStateIfMounted("empty");
    const [userType, setUserType] = useStateIfMounted("empty");
    const [cardButton, setCardButton] = useStateIfMounted(<button hidden={true}>button</button>);
    const [cardImage, setCardImage] = useStateIfMounted(loading);
    const [cardEmail, setCardEmail] = useStateIfMounted("empty");

    const emailUser = useSelector(state => state.emailUser);
    const friends = firebase.firestore().collection('friends');
    const notifications = firebase.firestore().collection('notifications');
    

    async function updateInfo(){ //método chamado na div principal ao montar componente
        setName( //<- carrega nome do usuário com link para o perfil
            <div>
                <Link to={props.email === emailUser ? `/profile` : `/profile/${props.profileId}`}> 
                    <div>
                        <span>{props.nome}</span>
                    </div>
                </Link>
            </div>     
        )    
        
        if (props.course != null){  setCourse(props.course)       }
        if (props.type != null){    setUserType(props.type)       }
        if (props.email != null){   setCardEmail(props.email)     }
        if(props.isFriend){
            console.log("pending>>> " + props.pending)
            if(props.pending == false){
                setCardButton(<button className='card-button' onClick={clickAction}>Desconectar</button>)
            } else {
                setCardButton(<button className='card-button' onClick={clickAction}>Esperando</button>)
            }
        }
        else {                      setCardButton(<button className='card-button' onClick={clickAction}>Conectar</button>)    }
        
        if (props.profilePhoto != null){ 
            firebase.storage().ref(`profile_images/`+ props.profilePhoto).getDownloadURL().then(url => setCardImage(url));    }
    };


    function clickAction(){
        if(props.isFriend){
            removeFriend(cardEmail);
            setCardButton(<button className='card-button'>Desconectado</button>);
        } else {
            addFriend(cardEmail);
        }
    }

    return(
        <div onLoad={updateInfo}>
            <div className="friend-card">
                    <span className="friend-content">
                        <img className="friend-img" src={cardImage} />
                        <h4 className="friend-name">{name}</h4>
                        <p className="friend-course"><b>{course}</b> </p>
                        <p className="friend-usertype">{userType}</p>
                    </span>
                    {cardButton}
            </div>
        </div>
    )

    //funções dos botões
    function removeFriend (email){

        friends.get().then(  
            (result) => {      
                result.docs.forEach(doc => {
                    if (doc.data().friend1 === emailUser && doc.data().friend2 === email || doc.data().friend2 === emailUser && doc.data().friend1 === email) {
                            friends.doc(doc.id).delete();
                        }
                    }
                )
            }
        )
    }

    function addFriend (email){
        


        friends.add({
            friend2: email,
            friend1: emailUser,
            pending: true
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });

        notifications.add({
            emailUser: email,
            seen: false,
            text: ("Você recebeu um convite de: " + emailUser),
            type: "friend_invite",
            timestamp: (new Date()),
            inviter: emailUser
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
        setCardButton(<button className='card-button'>Solicitado</button>);
    }
}