import React, { useState } from 'react';
import Modal from 'react-modal';
import './postVideo.css';

import firebase from '../../config/firebase';
import { useSelector } from 'react-redux';
import ButtonBackhome from '../../components/button-backhome';

function ModalPostVideo() {

    const [load, setLoad] = useState();
    const [details, setDetails] = useState();
    const [photo, setPhoto] = useState();
    const emailUser = useSelector(state => state.emailUser);

    const storege = firebase.storage();
    const db = firebase.firestore();
    const time = firebase.firestore.Timestamp;

    function enroll() {
        setLoad(1);
        storege.ref(`images/${photo.name}`).put(photo).then(() => {
            db.collection('events').add({
                details: details,
                photo: photo.name,
                emailUser: emailUser,
                views: 0,
                like: 0,
                share: 0,
                amountComment: 0,
                public: 1,
                tipo: 'v',
                dataTime: new Date()
            }).then((docRef) => {
                setLoad(0);
                console.log("Document written with ID: ", docRef.id);
            }).catch((error) => {
                setLoad(0);
                console.error("Error adding document: ", error);
            });
        });
    }

    return (
        <>
            <div className="col-12">
                <Modal isOpen={true}>
                    <div className="div__main">
                        <div className="div__header">
                            <div className="w-100">
                                <h3>Selecione seu Vídeo</h3>
                            </div>
                            <div>
                                <ButtonBackhome />
                            </div>
                        </div>
                        <hr/>
                        <div>
                            <form className="form">
                                <div className="row">
                                    <div>
                                        <div className="form-group">
                                            <label>Descrição</label>
                                            <textarea onChange={(e) => setDetails(e.target.value)} className="form-control" rows="3" placeholder="Ex.: tópicos, programa, etc."></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="form">
                                    <label>Carregar imagem:</label>
                                    <input onChange={(e) => setPhoto(e.target.files[0])} type="file" className="form-control" />
                                </div>
                                <div>
                                    {
                                        load ? <button className="form-control btn btn-lg btn-block mt-3 mb-5 btn-cadastro" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        </button> :
                                            <button onClick={enroll} type="button" className="form-control btn btn-lg btn-block mt-3 mb-5 btn-cadastro">Concluído</button>
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default ModalPostVideo;