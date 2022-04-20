import React, { useState } from 'react';
import Modal from 'react-modal';
import './editProfile.css';

import firebase from '../../config/firebase';
import { useSelector } from 'react-redux';
import ButtonBackhome from '../../components/button-backhome';

function ModalEditProfile() {

    const [load, setLoad] = useState();
    const [details, setDetails] = useState();
    const [profileInformatio, setProfileInformatio] = useState();
    const [userName, setUserName] = useState();
    const [profilePhoto, setProfilePhoto] = useState();
    const [coverPhoto, setCoverPhoto] = useState();
    const emailUser = useSelector(state => state.emailUser);

    const storege = firebase.storage();
    const db = firebase.firestore();

    function enroll() {
        setLoad(1);
        // storege.ref(`profile_images/${profilePhoto.name}`, `profile_images/${coverPhoto.name}`).put(profilePhoto, coverPhoto);
        let save = storege.ref(`profile_images/${profilePhoto.name}`).put(profilePhoto);
        save = storege.ref(`profile_images/${coverPhoto.name}`).put(coverPhoto);
        save.then(() => {
            db.collection('profiles').add({
                details: details,
                profileInformatio: profileInformatio,
                userName: userName,
                profilePhoto: profilePhoto.name,
                coverPhoto: coverPhoto.name,
                emailUser: emailUser,
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
                                <h3 className="mx-auto font-weight-bold">Editar Perfil</h3>
                            </div>
                            <div>
                                <ButtonBackhome />
                            </div>
                        </div>
                        <hr/>
                        <div>
                            <form className="form">
                                <div className="form-title">
                                    <label>Nome perfil:</label>
                                    <input onChange={(e) => setUserName(e.target.value)} type="text" className="form-control" placeholder="Adicione um nome ao perfil" />
                                </div>
                                <div className="row">
                                    <div className="form-group">
                                        <div className="form-group">
                                            <label>Informações de perfil</label>
                                            <textarea onChange={(e) => setProfileInformatio(e.target.value)} className="form-control" rows="3" placeholder="Ex.: estudante, professor, psicólogo, etc."></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label>Descrevar quem é você</label>
                                            <textarea onChange={(e) => setDetails(e.target.value)} className="form-control" rows="3" placeholder="Ex.: profissão, hobby, interesses, currículo acadêmico, etc."></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="form">
                                    <label>Carregar foto do perfil:</label>
                                    <input onChange={(e) => setProfilePhoto(e.target.files[0])} type="file" className="form-control" />
                                </div>
                                <div className="form">
                                    <label>Carregar imagem da capa:</label>
                                    <input onChange={(e) => setCoverPhoto(e.target.files[0])} type="file" className="form-control" />
                                </div>
                                <div className="row">
                                    {
                                        load ? <button className="form-control btn btn-lg btn-block mt-3 mb-5 btn-cadastro" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        </button> :
                                            <button onClick={enroll} type="button" className="form-control btn btn-lg btn-block mt-3 mb-5 btn-cadastro">Salvar alterações</button>
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

export default ModalEditProfile;