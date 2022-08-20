import React, { useEffect } from 'react';
import { useStateIfMounted } from 'use-state-if-mounted';

export default function Item_notification(props){

    const [type, setType] = useStateIfMounted("loading...")
    const [text, setText] = useStateIfMounted("loading...")
    const [time, setTime] = useStateIfMounted("loading...")

    useEffect(()=>{
        setType(props.type);
        setText(props.text)
        setTime(props.timestamp)
    })

    return(
        <div>
            <div>{props.type}</div>
            <div>{props.text}</div>
            <div>{props.timestamp}</div>
        </div>
    )
}