import React, { useState } from 'react';
import Modal from 'react-modal';
import './event.css';

import firebase from '../../config/firebase';
import { useSelector } from 'react-redux';

function ModalEvent() {

    const [carregando, setCarregando] = useState();
    const [titulo, setTitulo] = useState();
    const [tipo, setTipo] = useState();
    const [detalhes, setDetalhes] = useState();
    const [data, setData] = useState();
    const [hora, setHora] = useState();
    const [foto, setFoto] = useState();
    const emailUser = useSelector(state => state.emailUser);

    const storege = firebase.storage();
    const db = firebase.firestore();
    const time = firebase.firestore.Timestamp;

    function enroll() {
        setCarregando(1);
        storege.ref(`images/${foto.name}`).put(foto).then(() => {
            db.collection('eventos').add({
                titulo: titulo,
                tipo: tipo,
                detalhes: detalhes,
                data: data,
                hora: hora,
                foto: foto.name,
                emailUser: emailUser,
                views: 0,
                publico: 1,
                criacao: new Date()
            }).then((docRef) => {
                setCarregando(0);
                console.log("Document written with ID: ", docRef.id);
            }).catch((error) => {
                setCarregando(0);
                console.error("Error adding document: ", error);
            });
        });
    }

    return (
        <>
            <div className="col-12">
                <Modal isOpen={true}>
                    <div className="row">
                        <h3 className="mx-auto font-weight-bold">Criar Evento</h3>
                    </div>
                    <form className="form">
                        <div className="form-title">
                            <label>Título:</label>
                            <input onChange={(e) => setTitulo(e.target.value)} type="text" className="form-control" placeholder="Adicionar um título ao evento" />
                        </div>
                        <div className="row">
                            <div className="form-group">
                                <div className="form-group">
                                    <label>Tipo de Evento:</label>
                                    <select onChange={(e) => setTipo(e.target.value)} className="form-control">
                                        <option disabled selected value>-- Selecione um tipo --</option>
                                        <option>On-line</option>
                                        <option>Presencial</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Descrição do evento</label>
                                    <textarea onChange={(e) => setDetalhes(e.target.value)} className="form-control" rows="3" placeholder="Ex.: tópicos, programa, etc."></textarea>
                                </div>
                                <div className="form-group row">
                                    <div className="col-6">
                                        <label>Data de início</label>
                                        <input onChange={(e) => setData(e.target.value)} className="form-control" type="date"></input>
                                    </div>
                                    <div className="col-6">
                                        <label>Hora de início</label>
                                        <input onChange={(e) => setHora(e.target.value)} className="form-control" type="time"></input>
                                    </div>
                                </div>
                                {/* <select className="form-control">
                            <option></option>
                        </select> */}
                            </div>
                        </div>
                        <div className="form">
                            <label>Carregar imagem:</label>
                            <input onChange={(e) => setFoto(e.target.files[0])} type="file" className="form-control" />
                        </div>
                        <div className="row">
                            {
                                carregando ? <button className="form-control btn btn-lg btn-block mt-3 mb-5 btn-cadastro" type="button" disabled>
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                </button> :
                                    <button onClick={enroll} type="button" className="form-control btn btn-lg btn-block mt-3 mb-5 btn-cadastro">Públicar Evento</button>
                            }
                        </div>
                    </form>
                </Modal>
            </div>
        </>
    )
}

export default ModalEvent;