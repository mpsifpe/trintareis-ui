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
    const [friendInvite, setFriendInvite] = useStateIfMounted(<span></span>)

    useEffect(()=>{
        setType(props.type);
        setText(props.text);
        setTime(props.time);

        if(props.type === "friend_invite"){
            setType("Convite de amizade")
            showFriendInviteButton()
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
    }


    return(
        <div>
            <div className="notification-card">
                    <span className="notification-content">
                        <span className="notification-header">
                            <span className="notification-name">{type}</span> <span className="notification-timestamp">{time}</span></span>
                        <span className="notification-text">{text}</span>
                        {friendInvite}
                    </span>
                    
            </div>
        </div>
    )
}