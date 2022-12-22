import './course-card.css';
import React, {useState, useContext} from 'react';
import { useLocation } from "react-router-dom";
import { isEmpty } from '../../helpers/helper';
import NotyfContext from '../notyf-toast/NotyfContext';
import loading from '../../resources/loading.gif';
import firebase from '../../config/firebase';


export default function CourseCard(props) {

    //const notyf = useContext(NotyfContext);
    //let location = useLocation();
    const storage = firebase.storage();

    const [title, setTitle] = useState(props.title);
    const [description, setDescription] = useState(props.description);
    //const [courseID, setCourseID] = useState("");
    const [level, setLevel] = useState(props.level);
    //const [institutions, setInstitutions] = useState([]);
    const [type, setType] = useState(props.type)
    const [cardImage, setCardImage] = useState(loading);
    const [cardButton, setCardButton] = useState(<div className='div__card-button'><button className='card-button' onClick={clickAction}>Detalhes</button></div>);
    const [cardState, setCardState] = useState("friend-card");
    const [cardText, setCardText] = useState("")

    async function updateInfo(){ //método chamado na div principal ao montar componente
              
        //setCourseID(props.courseID)
        //setDescription(props.description)
        //setType(props.type)
        //!isEmpty(props.level) ? setLevel(props.level) : setLevel("");
        //!isEmpty(props.institutions) ? setInstitutions(props.institutions) : setInstitutions([]);
        
        /*
        storage.ref("profile_images/" + props.profilePhoto).getDownloadURL()
            .then(url => setCardImage(url))
            .catch(()=>{setCardImage(user)})}
        */
        storage.ref("profile_images/book.png").getDownloadURL()
        .then(url => setCardImage(url))
        .catch(()=>{setCardImage(loading)})

        if(type === "superior"){setType("Graduação")}
        else if (type === "lato"){setType("Pós-graduação lato sensu")}
        else if (type === "stricto"){setType("Pós-graduação stricto sensu")}

        (description.length > 50) ? setCardText(description.substring(0, 50) + "...") : setCardText(description)

    };

    function clickAction(){
        if(cardState === "friend-card") {
            setCardState("friend-card-open");
            /*(description.length > 200) ? setCardText(description.substring(0, 200) + "...") : */setCardText(description)
        } 
        else {
            setCardState("friend-card");
            (description.length > 50) ? setCardText(description.substring(0, 50) + "...") : setCardText(description)
        }

    }

    
    return(
        <div onLoad={updateInfo}>         
            <div className={cardState}>
                <div style={{marginBotton:"10px", display:"grid"}}>
                    <span className="friend-content">                        
                            <img className="friend-img" src={cardImage} alt="user image"/>
                            <p>{title}</p>
                            <p className="friend-course">{level}</p>
                            <p className="friend-usertype">
                                <div>
                                    {cardText}
                                </div>
                            </p>
                    </span>
                </div>
                <div style={{marginTop:"10px"}}>{cardButton}</div>
            </div>
        </div>
    )
}