import './notification-card.css';
import React, {useEffect} from 'react';
import { useStateIfMounted } from 'use-state-if-mounted';
import { useSelector } from 'react-redux';
import { notifyAcceptInvite, updateNotificationSeen, deleteNotification, updateNotificationText } from '../../helpers/notification-helper';
//import { acceptInvite, removeFriend } from '../../helpers/friend-helper';


export default function NotificationCard(props) {

    const emailUser = useSelector(state => state.emailUser);

    const [type, setType] = useStateIfMounted("loading...")
    const [text, setText] = useStateIfMounted("loading...")
    const [time, setTime] = useStateIfMounted("loading...")
    const [seen, setSeen] = useStateIfMounted(false)
    const [friendInviteShow, setFriendInviteShow] = useStateIfMounted(<span></span>)

    useEffect(()=>{
        setType(props.type);
        setText(props.text);
        setTime(props.time);

        if(props.seen){ setSeen(true) }

        if(props.type === "friend_accept"){ setType("Convite de amizade aceito")  }

        if(props.type === "friend_invite"){
            setType("Convite de amizade")
            if(!props.seen){
                setFriendInviteShow(
                    <span className="notification-button-span">
                        <button className="notification-button" onClick={acceptFriendButtonClick}>ACEITAR</button> 
                        <button className="notification-button" onClick={denyFriendButtonClick}>NEGAR</button>
                    </span>
                )
            }
        }

    },[]);

    function acceptFriendButtonClick(){
        //acceptInvite(props.inviter, emailUser);
        setFriendInviteShow(<span>Solicitação de amizade aceita</span>)
        notifyAcceptInvite(props.inviter, emailUser);
        updateNotificationSeen(props.id, true);
        let newtext = ("Você e " + props.inviter + " agora são amigos");
        setText(newtext);
        //updateNotificationText(props.id, newtext);
    }

    function denyFriendButtonClick(){
        //removeFriend(props.inviter, emailUser);
        deleteNotification(props.id);
        setFriendInviteShow(<span>Solicitação de amizade recusada</span>);
    }

    function setSeenOnClick(){
        if(seen === false){
            updateNotificationSeen(props.id, true);
            setSeen(true);
        }
    }

    return(
        <div>
            <div className={seen ? "notification-card-seen" : "notification-card-unseen"} onClick={setSeenOnClick}>
                    <span className="notification-content" onClick={setSeenOnClick}>
                        <span className="notification-header" onClick={setSeenOnClick}>
                            <span className="notification-name">{type}</span> <span className="notification-timestamp">{time}</span></span>
                        <span className="notification-text">{text}</span>
                        {friendInviteShow}
                    </span>
                    
            </div>
        </div>
    )
}