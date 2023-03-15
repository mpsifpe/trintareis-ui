import './course-card.css';
import React, {useState, useContext, useEffect} from 'react';
import { Link, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import loading from '../../resources/loading.gif';
import firebase from '../../config/firebase';
import { isEmpty, isURL } from '../../helpers/helper';
import api from '../../config/api';
import NotyfContext from '../notyf-toast/NotyfContext';



export default function CourseCard(props) {

    const emailUser = useSelector(state => state.emailUser);  
    const storage = firebase.storage();
    const notyf = useContext(NotyfContext);
    let location = useLocation();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(()=>{
        let abortController = new AbortController();
        
        !isEmpty(props.title) ? setTitle(props.title) : setTitle("")
        !isEmpty(props.description) ? setDescription(props.description) : setDescription("")
        
        return function cleanup() {
            abortController.abort();
        }  
    },[]);

    return(
        <div>         
            <div className="friend-card">
                <span className="friend-content">
                    <div>{title}</div>
                    <div>{description}</div>
                </span>                    
            </div>
        </div>
    )
}