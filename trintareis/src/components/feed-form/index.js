import React, { useState } from 'react';
import { AiFillVideoCamera, AiFillPicture } from "react-icons/ai";
import { BsCalendarDate } from "react-icons/bs";
import { Link } from "react-router-dom";
import './feedForm.css'

import { useSelector } from 'react-redux';
import Modal from "../modal/Modal";
import useModalState from "../../hooks/useModalState";

import firebase from '../../config/firebase';
import api from '../../config/api';

export default function (props) {
    const [isModalOpen, openModal, closeModal] = useModalState();

    const [load, setLoad] = useState();
    const [details, setDetails] = useState();
    const [photo, setPhoto] = useState();
    const emailUser = useSelector(state => state.emailUser);

    const storege = firebase.storage();

    function enroll() {
        setLoad(1);
        storege.ref(`images/${photo.name}`).put(photo);

        api.post('/post-photo/create', {
            userEmail: emailUser,
            photoName: photo.name,
            details: details,
            views: 0,
            hour: new Date()
        }).then((docRef) => {
            setLoad(0);
            console.log("Document written with ID: ", docRef.id);
        }).catch((error) => {
            setLoad(0);
            console.error("Error adding document: ", error);
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
                    <div className="div__button">
                        <Link to='createPublication' style={{ textDecoration: 'none' }}>
                            <div className="div__span">
                                <span>Começar publicar...</span>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="feedForm__icons">
                    <div className="iconSingle img feedForm__reaction">
                        <button onClick={openModal}>
                            <AiFillPicture />
                            <span>
                                Foto
                            </span>
                        </button>
                        {/* <Link to='postPhoto' style={{ textDecoration: 'none' }}>
                            <button type="submit">
                                <AiFillPicture />
                                <span>
                                    Foto
                                </span>
                            </button>
                        </Link> */}
                    </div>
                    <div className="iconSingle feedForm__reaction">

                        <button type="submit">
                            <AiFillVideoCamera />
                            <span>
                                Vídeo
                            </span>
                        </button>

                    </div>
                    <div className="iconSingle evn feedForm__reaction">
                        <Link to='event' style={{ textDecoration: 'none' }}>
                            <button type="submit">
                                <BsCalendarDate />
                                <span className="feedForm__link">
                                    Evento
                                </span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <Modal title='Publicar' isOpen={isModalOpen} onClose={closeModal}>
                <Modal.Content>
                    <form className="form">
                        <div className="row">
                            <div>
                                <div className="div__description">
                                    <label>Descrição</label>
                                    <textarea onChange={(e) => setDetails(e.target.value)} className="form-control" rows="30" placeholder="Ex.: tópicos, programa, etc."></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <label>Carregar imagem:</label>
                            <input onChange={(e) => setPhoto(e.target.files[0])} type="file" className="form-control" />
                        </div>
                    </form>
                </Modal.Content>
                <Modal.Footer>
                    <div className="div__btn_post">
                        {
                            load ? <button className="form-control btn btn-lg btn-block mt-3 mb-5 btn-cadastro" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            </button> :
                                <button onClick={enroll} type="button">Postar</button>
                        }
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    )
}