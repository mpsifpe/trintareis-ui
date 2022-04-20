import React, { useState } from 'react';
import Modal from 'react-modal';
import './event.css';

import firebase from '../../config/firebase';
import { useSelector } from 'react-redux';
import ButtonBackhome from '../../components/button-backhome';

function ModalEvent() {

    const [load, setLoad] = useState();
    const [title, setTitle] = useState();
    const [type, setType] = useState();
    const [details, setDetails] = useState();
    const [data, setData] = useState();
    const [hour, setHour] = useState();
    const [photo, setPhoto] = useState();
    const emailUser = useSelector(state => state.emailUser);

    const storege = firebase.storage();
    const db = firebase.firestore();
    // const time = firebase.firestore.Timestamp;

    function enroll() {
        setLoad(1);
        storege.ref(`images/${photo.name}`).put(photo).then(() => {
            db.collection('events').add({
                title: title,
                type: type,
                details: details,
                data: data,
                hour: hour,
                photo: photo.name,
                emailUser: emailUser,
                views: 0,
                public: 1,
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
                                <h3 className="mx-auto font-weight-bold">Criar Evento</h3>
                            </div>
                            <div>
                                <ButtonBackhome />
                            </div>
                        </div>
                        <hr/>
                        <div>
                            <form className="form">
                                <div className="form-title">
                                    <label>Título:</label>
                                    <input onChange={(e) => setTitle(e.target.value)} type="text" className="form-control" placeholder="Adicionar um título ao evento" />
                                </div>
                                <div className="row">
                                    <div className="form-group">
                                        <div className="form-group">
                                            <label>Tipo de Evento:</label>
                                            <select onChange={(e) => setType(e.target.value)} className="form-control">
                                                <option disabled selected value>-- Selecione um tipo --</option>
                                                <option>On-line</option>
                                                <option>Presencial</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Descrição do evento</label>
                                            <textarea onChange={(e) => setDetails(e.target.value)} className="form-control" rows="3" placeholder="Ex.: tópicos, programa, etc."></textarea>
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-6">
                                                <label>Data de início</label>
                                                <input onChange={(e) => setData(e.target.value)} className="form-control" type="date"></input>
                                            </div>
                                            <div className="col-6">
                                                <label>Hora de início</label>
                                                <input onChange={(e) => setHour(e.target.value)} className="form-control" type="time"></input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form">
                                    <label>Carregar imagem:</label>
                                    <input onChange={(e) => setPhoto(e.target.files[0])} type="file" className="form-control" />
                                </div>
                                <div className="row">
                                    {
                                        load ? <button className="form-control btn btn-lg btn-block mt-3 mb-5 btn-cadastro" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        </button> :
                                            <button onClick={enroll} type="button" className="form-control btn btn-lg btn-block mt-3 mb-5 btn-cadastro">Públicar Evento</button>
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

export default ModalEvent;