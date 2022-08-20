import './notification-card.css';
import React, {useEffect} from 'react';
import { useStateIfMounted } from 'use-state-if-mounted';



export default function NotificationCard(props) {

    const [type, setType] = useStateIfMounted("loading...")
    const [text, setText] = useStateIfMounted("loading...")
    const [time, setTime] = useStateIfMounted("loading...")

    useEffect(()=>{
        setType(props.type);
        setText(props.text);
        setTime(props.time);
    },[]);

    return(
        <div>
            <div className="notification-card">
                    <span className="notification-content">
                        <span className="notification-header">
                            <span className="notification-name">{type}</span> <span className="notification-timestamp">{time}</span></span>
                        <span className="notification-text">{text}</span>
                        
                    </span>
            </div>
        </div>
    )
}