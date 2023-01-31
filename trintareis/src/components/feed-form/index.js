import React, { useState, useContext } from 'react';
import { HiPhotograph, HiVideoCamera, HiMenuAlt2 } from "react-icons/hi";
import { BsCalendarDate } from "react-icons/bs";
import { Link } from "react-router-dom";
import './feedForm.css'

import { useSelector } from 'react-redux';
import Modal from "../modal/Modal";
import useModalState from "../../hooks/useModalState";

import firebase from '../../config/firebase';
import api from '../../config/api';
import { isEmpty } from '../../helpers/helper';
import NotyfContext from '../notyf-toast/NotyfContext';

export default function (props) {
    const [isTextPostOpen, openTextPost, closeTextPost] = useModalState();
    const [isPhotoPostOpen, openPhotoPost, closePhotoPost] = useModalState();
    const [isVideoPostOpen, openVideoPost, closeVideoPost] = useModalState();

    const notyf = useContext(NotyfContext);

    const [text, setText] = useState();
    const [photo, setPhoto] = useState();
    const [video, setVideo] = useState();
    const [errorMessage, setErrorMessage] = useState(<></>);
    const emailUser = useSelector(state => state.emailUser);

    const storage = firebase.storage();

    function postPhotoClick() {
        
        if (!isEmpty(photo)){
            setErrorMessage(<></>)

            let timestamp = new Date()
            let fileName = emailUser + "_" + timestamp.getTime() + "." + photo.name.split(".").pop()
           
            api.post('/content/post-content', {
                    userEmail: emailUser,
                    photoName: fileName,
                    text: text,
                    title: photo.name,
                    views: 0,
                    hour: timestamp,
                    publicPost: true,
                    share:0,
                    typePost: "POST_PHOTO"
                }
            ).then((docRef) => {
                console.log(docRef);
                storage.ref(`images/`+ fileName).put(photo);
                closePhotoPost();

            }).catch((error) => {
                console.error("Error adding document: ", error);
                notyf.error("Opa, ocorreu um erro. Favor tentar novamente mais tarde");
            });

        }
        else{
            setErrorMessage(<span style={{color: 'red'}}>Imagem não selecionada</span>)
        }

    }

    function showNotification(){
        notyf.open({
            type: 'info',
            message: 'Em desenvolvimento'
          });
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
                    <div className="div__button" onClick={openTextPost}>
                        <div style={{ textDecoration: 'none' }}>
                            <div className="div__span">
                                <span>Nova publicação</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="feedForm__icons">
                    <div className="iconSingle img feedForm__reaction">
                        <button onClick={openPhotoPost}>
                            <HiPhotograph  className='feedForm_svg'/>
                            <div className="feedForm__link">
                                <span>Imagem</span>
                            </div>
                        </button>
                    </div>
                    <div className="iconSingle feedForm__reaction">
                        <button onClick={openVideoPost}>
                            <HiVideoCamera className='feedForm_svg'/>
                            <div className="feedForm__link">
                                <span>Video</span>
                            </div>
                        </button>
                    </div>
                    <div className="iconSingle evn feedForm__reaction">
                            <button onClick={showNotification}>
                                <HiMenuAlt2 className='feedForm_svg'/>
                                <div className="feedForm__link">
                                    <span>Artigo</span>
                                </div>
                            </button>
                    </div>
                </div>
            </div>

            {/* Modal para postar foto  */}
            <Modal title='Publicar' isOpen={isPhotoPostOpen} onClose={closePhotoPost}>
                <Modal.Content>
                    <form className="form">
                        <div className="row">
                            <div>
                                <div className="div__description">
                                    <label>Descrição</label>
                                    <textarea onChange={(e) => setText(e.target.value)} className="form-control" rows="30" placeholder="Ex.: tópicos, programa, etc." maxLength={300} style={{height:"100px"}}></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <label>Carregar imagem</label>
                            <input onChange={(e) => setPhoto(e.target.files[0])} type="file" className="form-control" accept=".jpg, .png, .jpeg, .bmp"/>
                            {errorMessage}
                        </div>
                    </form>
                </Modal.Content>
                <Modal.Footer>
                    <div className="div__btn_post">
                        <button onClick={postPhotoClick} type="button" disabled={false}>Postar</button>
                    </div>
                </Modal.Footer>
            </Modal>

            {/* Modal para postar vídeo  */}
            <Modal title='Publicar' isOpen={isVideoPostOpen} onClose={closeVideoPost}>
                <Modal.Content>
                    <form className="form">
                        <div className="row">
                            <div>
                                <div className="div__description">
                                    <label>Descrição</label>
                                    <textarea onChange={(e) => setText(e.target.value)} className="form-control" rows="30" placeholder="Ex.: tópicos, programa, etc." maxLength={300} style={{height:"100px"}}></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <label>Carregar vídeo</label>
                            <input onChange={(e) => setPhoto(e.target.files[0])} type="file" className="form-control" accept=".jpg, .png, .jpeg, .bmp"/>
                            {errorMessage}
                        </div>
                    </form>
                </Modal.Content>
                <Modal.Footer>
                    <div className="div__btn_post">
                        <button onClick={postPhotoClick} type="button" disabled={false}>Postar</button>
                    </div>
                </Modal.Footer>
            </Modal>

            {/* Modal para postar texto  */}
            <Modal title='Publicar' isOpen={isTextPostOpen} onClose={closeTextPost}>
                <Modal.Content>
                    <form className="form">
                        <div className="row">
                            <div>
                                <div className="div__description">
                                    <label>Descrição</label>
                                    <textarea onChange={(e) => setText(e.target.value)} className="form-control" rows="10" placeholder="Ex.: tópicos, programa, etc." maxLength={300} style={{height:"200px"}}></textarea>
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal.Content>
                <Modal.Footer>
                    <div className="div__btn_post">
                        <button onClick={postPhotoClick} type="button" disabled={false}>Postar</button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    )
}