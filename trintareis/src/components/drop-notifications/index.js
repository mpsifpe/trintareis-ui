import React, {useEffect} from 'react';
import { useStateIfMounted } from 'use-state-if-mounted';
import { useSelector } from 'react-redux';
import firebase from '../../config/firebase';

export default function Drop_notifications(props){
    
    const [notifList, setNotifList] = useStateIfMounted([]);
    
    const emailUser = useSelector(state => state.emailUser);

    useEffect(()=>{
        setNotifList(fetch())
    })
    
    return(
        <span></span>
    )
}


/////////////////////// funções auxiliares ///////////////////////////////////

async function fetch() {
    const notificationsCollection = firebase.firestore().collection('notifications');

    let tempList = []

    notificationsCollection.where('emailUser', '==', emailUser).orderBy("timestamp","desc").get().then((notifications) => {
        notifications.forEach((notif) => {
            tempList.push([{
                id : notif.id,
                timestamp : notif.data().timestamp,
                seen: notif.data().seen,
                type: notif.data().type,
                text: notif.data().text
            }])
        });
    })

    return tempList;
}
