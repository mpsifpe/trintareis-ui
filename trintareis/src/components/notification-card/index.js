import './notification-card.css';
import React, {useEffect} from 'react';
import { useStateIfMounted } from 'use-state-if-mounted';
import { useSelector } from 'react-redux';
import firebase from '../../config/firebase';


export default function NotificationCard(props) {

    const emailUser = useSelector(state => state.emailUser);
    const friends = firebase.firestore().collection('friends');
    const notifications = firebase.firestore().collection('notifications');

    const [type, setType] = useStateIfMounted("loading...")
    const [text, setText] = useStateIfMounted("loading...")
    const [time, setTime] = useStateIfMounted("loading...")
    const [seen, setSeen] = useStateIfMounted(false)
    const [friendInvite, setFriendInvite] = useStateIfMounted(<span></span>)

    useEffect(()=>{
        setType(props.type);
        setText(props.text);
        setTime(props.time);

        if(props.type === "friend_invite"){
            setType("Convite de amizade")
            showFriendInviteButton()
        }

        if(props.type === "friend_accept"){
            setType("Convite de amizade aceito")
            showFriendInviteButton()
        }

        if(props.seen){
            setSeen(true)
        }

    },[]);

    function showFriendInviteButton(){
        setFriendInvite(
            <span className="notification-button-span">
                <button className="notification-button" onClick={acceptFriendInvite}>aceitar</button> 
                <button className="notification-button" onClick={denyFriendInvite}>negar</button>
            </span>
        )
    }

    function acceptFriendInvite(){
        console.log("hello, brother");
        notifications.doc(props.id).delete();
        friends.
            where("friend2", "==", emailUser).
            where("friend1", "==", props.inviter).
            get().then((docs) => {
                docs.forEach((doc) => {
                    friends.doc(doc.id).update({pending: false})
                })
            }
        )
        setFriendInvite(<span>Solicitação de amizade aceita</span>)

        notifications.add({
            emailUser: props.inviter,
            seen: false,
            text: ("Sua solicitação de amizade foi aceita por " + emailUser),
            type: "friend_accept",
            timestamp: (new Date()),
            inviter: ""
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });

        notifications.where("id", "==", props.id).get().then((docs) => {
            docs.forEach((doc) => {
                friends.doc(doc.id).update({seen: true})
            })
            
        })
    }

    function denyFriendInvite(){
        console.log("do I know you?")
        notifications.doc(props.id).delete();
        friends.
            where("friend2", "==", emailUser).
            where("friend1", "==", props.inviter).
            get().then((docs) => {
                docs.forEach((doc) => {
                    friends.doc(doc.id).delete();                 
                })
            }
        )
        setFriendInvite(<span>Solicitação de amizade recusada</span>)
    }

    function setNotificationSeen(){
        if(seen === false){
            notifications.where("emailUser", "==", emailUser).get().then((docs) => {
                docs.forEach((doc) => {
                    if(doc.id == props.id){
                        notifications.doc(props.id).update({seen: true})
                        setSeen(true);
                    }
                }) 
            })
        }
    }

    return(
        <div>
            <div className={seen ? "notification-card-seen" : "notification-card-unseen"} onClick={setNotificationSeen}>
                    <span className="notification-content" onClick={setNotificationSeen}>
                        <span className="notification-header" onClick={setNotificationSeen}>
                            <span className="notification-name">{type}</span> <span className="notification-timestamp">{time}</span></span>
                        <span className="notification-text">{text}</span>
                        {friendInvite}
                    </span>
                    
            </div>
        </div>
    )
}