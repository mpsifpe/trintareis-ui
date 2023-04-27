import './feedForm.css';

import React, { useState, useContext } from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

import { HiPhotograph, HiVideoCamera, HiMenuAlt2 } from "react-icons/hi";

import Modal from "../modal/Modal";
import useModalState from "../../hooks/useModalState";

import api from '../../config/api';
import firebase from '../../config/firebase';
import { isEmpty } from '../../helpers/helper';
import NotyfContext from '../notyf-toast/NotyfContext';
import loading from '../../resources/loading.gif';
import { homeRefreshContext } from '../../view/home';

export default function (props) {
    const [isPostOpen, openPost, closePost] = useModalState();

    const emailUser = useSelector(state => state.emailUser);
    const storage = firebase.storage();
    const notyf = useContext(NotyfContext);
    const {homeRefresh, setHomeRefresh} = useContext(homeRefreshContext);

    const [textField, setTextField] = useState('');
    const [file, setFile] = useState();
    const [errorMessage, setErrorMessage] = useState(<></>);
    const [button, setButton] = useState(<button type="button" disabled={false} onClick={clickButtonHandle}>Postar</button>)
    const [type, setType] = useState("text");
    const [media, setMedia] = useState(<></>);
    const [field, setField] = useState(<></>);

    function clickButtonHandle(){
        setField(<div><br/></div>);
        console.log(type);
        
        let text;
        try {
            text = document.getElementById("textInpt").value.toString();
        } catch{
            text = ""
        }

        let photo;
        try {
            photo = document.getElementById("imgInpt").files[0];
        } catch{
            photo = ""
        }
        
        let link;
        try {
            link = document.getElementById("linkInpt").value.toString();
        } catch{
            link = ""
        }
        
        if (!isEmpty(photo)){
            console.log("POST_PHOTO");
            setButton(<button type="button" disabled={true}> <img src={loading} style={{height: '25px', alignSelf: 'center', opacity: '0.75'}}/> </button>)
            setErrorMessage(<></>)

            let timestamp = new Date()
            let fileName = emailUser + "_" + timestamp.getTime() + "." + photo.name.split(".").pop();           

            storage.ref("images/"+ fileName).put(photo).then(()=>{
                api.post('/content/post-content', {
                    userEmail: emailUser,
                    photoName: fileName,
                    text: text,
                    title: fileName,
                    views: 0,
                    hour: timestamp,
                    publicPost: true,
                    share:0,
                    typePost: "POST_PHOTO"
                    }
                ).then((docRef) => {
                    console.log(docRef);
                    setButton(<button type="button" disabled={false} onClick={clickButtonHandle}>Postar</button>);
                    closePost();
                    setHomeRefresh(true);
    
                }).catch((error) => {
                    console.error("Error adding document: ", error);
                    notyf.error("Opa, ocorreu um erro. Favor tentar novamente mais tarde");
                    setButton(<button type="button" disabled={false} onClick={clickButtonHandle}>Postar</button>);
                    setHomeRefresh(true);
                });
            });
        }
        
        if (!isEmpty(link)){
            console.log("POST_VIDEO");
            setButton(<button type="button" disabled={true}> <img src={loading} style={{height: '25px', alignSelf: 'center', opacity: '0.75'}}/> </button>)
            setErrorMessage(<></>)

            api.post('/content/post-content', {
                userEmail: emailUser,
                photoName: link,
                text: text,
                title: "video",
                views: 0,
                hour: new Date(),
                publicPost: true,
                share:0,
                typePost: "POST_VIDEO"
            }
            ).then((docRef) => {
                console.log(docRef);
                setButton(<button type="button" disabled={false} onClick={clickButtonHandle}>Postar</button>);
                closePost();
                setHomeRefresh(true);

            }).catch((error) => {
                console.error("Error adding document: ", error);
                notyf.error("Opa, ocorreu um erro. Favor tentar novamente mais tarde");
                setButton(<button type="button" disabled={false} onClick={clickButtonHandle}>Postar</button>);
                setHomeRefresh(true);
            })

        }
        
        if( isEmpty(link) && isEmpty(photo) && !isEmpty(text)){
            console.log("POST_TEXT");
            setButton(<button type="button" disabled={true}> <img src={loading} style={{height: '25px', alignSelf: 'center', opacity: '0.75'}}/> </button>)
            api.post('/content/post-content', {
                userEmail: emailUser,
                text: text,
                views: 0,
                hour: new Date(),
                publicPost: true,
                share:0,
                typePost: "POST_TEXT"
            }
            ).then((docRef) => {
                console.log(docRef);
                setButton(<button type="button" disabled={false} onClick={clickButtonHandle}>Postar</button>);
                closePost();
                setHomeRefresh(true);

            }).catch((error) => {
                console.error("Error adding document: ", error);
                notyf.error("Opa, ocorreu um erro. Favor tentar novamente mais tarde");
                setButton(<button type="button" disabled={false} onClick={clickButtonHandle}>Postar</button>)   });
                setHomeRefresh(true);
        }
    }

    function showNotification(){
        notyf.open({
            type: 'info',
            message: 'Em desenvolvimento'
        });
    }

    function typeHandler(type){
        switch(type){
            case "text":
                setType("text");
                setMedia(<></>);
            break
            
            case "photo":
                setType("photo");
                setMedia(
                    <div className="">
                        <label>Carregar imagem</label>
                        <input id="imgInpt" onChange={(e)=>{setFile(e.target.value[0])}} type="file" className="form-control" accept=".jpg, .png, .jpeg, .bmp"/>
                        {errorMessage}
                    </div>
                )
            break

            case "video":
                setType("video");
                setMedia(
                    <div className="">
                        <label>Link do video</label>
                        <input id="linkInpt" type="text" className="form-control" style={{width : "85vh"}}/>
                        {errorMessage}
                    </div>
                )
            break
        }
    }

    return (
        <div className="feed">
            <div className="feedForm">
                <div className="div__header">
                    <div className="div__foto">
                        <div>
                            <Link to="profile">
                                <img src={props.profilePhoto} />
                            </Link>
                        </div>
                    </div>
                    <div className="div__button" onClick={openPost}>
                        <div style={{ textDecoration: 'none' }}>
                            <div className="div__span">
                                <span>Nova publicação</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal title='Publicar' isOpen={isPostOpen} onClose={closePost}>
                <Modal.Content>
                    <form className="form">
                        <div className="row">
                            <div>
                                <div className="div__description">
                                    <label>Descrição</label>
                                    <textarea id="textInpt" onChange={()=>setTextField(document.getElementById("textInpt").value.toString())} className="form-control" height="auto" cols="20" spellCheck="true" wrap="hard" placeholder="Ex.: tópicos, programa, etc." maxLength={500} style={{height:"100px"}}></textarea>
                                    <div style={{float:"right"}}>Caracteres restantes:
                                        {isEmpty(textField) ? 500 : 500 - textField.length}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="radioButtonsForm">
                            <div className="form-check">
                            <label>
                                <input
                                    type="radio"
                                    name="react-tips"
                                    value="text"
                                    checked={type === "text"}
                                    onChange={(e) => typeHandler(e.target.value)}
                                    className="form-check-input"/>
                                Texto
                            </label>
                            </div>

                            <div className="form-check">
                            <label>
                                <input
                                    type="radio"
                                    name="react-tips"
                                    value="photo"
                                    checked={type === "photo"}
                                    onChange={(e) => typeHandler(e.target.value)}
                                    className="form-check-input"/>
                                Imagem
                            </label>
                            </div>

                            <div className="form-check">
                            <label>
                                <input
                                    type="radio"
                                    name="react-tips"
                                    value="video"
                                    checked={type === "video"}
                                    onChange={(e) => typeHandler(e.target.value)}
                                    className="form-check-input"/>
                                Video
                            </label>
                            </div>
                        </div>
                        {field}
                        {media}
                    </form>
                </Modal.Content>
                <Modal.Footer>
                    <div className="div__btn_post">
                        {button}
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    )
}