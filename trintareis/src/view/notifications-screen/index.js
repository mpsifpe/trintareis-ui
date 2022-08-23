import './notifications-screen.css';
import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import Header from '../../components/header/index';
import firebase from '../../config/firebase';
import { useStateIfMounted } from 'use-state-if-mounted';
import NotificationCard from '../../components/notification-card';



export default function NotificationsScreen() {

    const emailUser = useSelector(state => state.emailUser);
    const notifications = firebase.firestore().collection('notifications');

    const [notifData, setNotifData] = useStateIfMounted([]);
    const [notifList, setNotifList] = useStateIfMounted(<div></div>);
    const [newCount, setNewCount] = useStateIfMounted(0);
    
    const [finished, setFinished] = useStateIfMounted(false);
    const [cardsLoaded, setCardsLoaded] = useStateIfMounted(false);

    useEffect(()=>{
        let abortController = new AbortController();

        if(!finished && !cardsLoaded){
            console.log("fetch");
            fetchNotifications();}
        
        if(finished){
            console.log("cards");
            setCardsLoaded(true);
            mountList();
        }

        return function cleanup() {
            abortController.abort();
        }  
    },[finished]);

    function fetchNotifications(){
        let count = 0;
        let list = [];
        setNewCount(0);

        notifications.where("notifyUser", "==", emailUser).orderBy("timestamp", "desc").get().then((result) => {
            result.forEach((notif) => {
                count = count + 1;
                list.push({
                    id: notif.id,
                    seen: notif.data().seen,
                    text: notif.data().text,
                    type: notif.data().type,
                    time: notif.data().timestamp.toDate(),
                    inviter: notif.data().inviter,
                    response: notif.data().response
                });

                if (!notif.data().seen){ setNewCount(newCount + 1) }

                if (result.size === 1 || count === result.size-1){
                    setNotifData(list);
                    setFinished(true);
                }
            });
        });
    }

    function mountList(){
        setNotifList (
            <span>
                {notifData.map(notif => ( 
                                <div onClick={decreaseNewCount}>
                                    <NotificationCard 
                                        key={notif.id}
                                        id={notif.id}
                                        type={notif.type}
                                        text={notif.text}
                                        time={notif.timestamp}
                                        inviter={notif.inviter}
                                        seen={notif.seen}
                                        response={notif.response}
                                        />
                                </div>
                ))}
            </span>
        );
    }

    function decreaseNewCount(){
        if (newCount > 0){
            setNewCount(newCount - 1)
        }
    }

    return (
        <div className="App">
            <div><Header/></div>
                <div className="div__main_notifications">
                    <div className="div__title_notifications">
                        <span>Notificações</span>
                        <span>({newCount})</span>
                    </div>
                    
                    <section className="section_notifications_list">
                        {notifList}
                    </section>
                </div>
        </div>
    )

};