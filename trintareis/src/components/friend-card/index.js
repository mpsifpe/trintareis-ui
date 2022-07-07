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
        if(props.isFriend){         setCardButton(<button className='card-button' onClick={clickAction}>Desconectar</button>) }
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
            setCardButton(<button className='card-button'>Conectado</button>);
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
        const db = firebase.firestore().collection('friends');

        db.get().then(  
            (result) => {      
                result.docs.forEach(doc => {
                    if (doc.get("friend1") === emailUser && doc.get("friend2") === email || doc.get("friend2") === emailUser && doc.get("friend1") === email) {
                            db.doc(doc.id).delete();
                        }
                    }
                )
            }
        )
    }

    function addFriend (email){
        const db = firebase.firestore().collection('friends');
        
        db.add({
            friend2: email,
            friend1: emailUser,
            pending: true
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }
}