import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './editProfile.css';

import firebase from '../../config/firebase';
import { useSelector } from 'react-redux';
import ButtonBackhome from '../../components/button-backEditProfile';
import loading from '../../resources/loading.gif';
import { hasProfile } from '../../helpers/profile-helper';

function ModalEditProfile(props) {

    const [load, setLoad] = useState();
    const [details, setDetails] = useState();
    const [profileInformatio, setProfileInformatio] = useState();
    const [userName, setUserName] = useState();
    const [profilePhoto, setProfilePhoto] = useState();
    const [profilePhotoNew, setProfilePhotoNew] = useState();
    const [coverPhoto, setCoverPhoto] = useState();
    const [coverPhotoNew, setCoverPhotoNew] = useState();
    const [region, setRegion] = useState();
    const [city, setCity] = useState();
    const [firstLogin, setFirstLogin] = useState(true);
    const emailUser = useSelector(state => state.emailUser);

    const storage = firebase.storage();
    const db = firebase.firestore();

    useEffect(() => {
        let abortController = new AbortController();

        hasProfile(emailUser) ? setFirstLogin(false) :  setFirstLogin(true);

        if(props.match.params.id){
            firebase.firestore().collection('profiles').doc(props.match.params.id).get().then(async (result) => {
                setProfilePhoto(result.data().profilePhoto);
                setCoverPhoto(result.data().coverPhoto);
                setDetails(result.data().details);
                setProfileInformatio(result.data().profileInformatio);
                setUserName(result.data().userName);
                setRegion(result.data().region);
                setCity(result.data().city);
            })
        }

        return function cleanup() {
            abortController.abort()
        }
    }, []);

    function isEmpty(value) {
        return (value == null || value.length === 0);
    }

    function update() {
        setLoad(1);

        if (profilePhotoNew)
            storage.ref(`profile_images/${profilePhotoNew.name}`).put(profilePhotoNew);

        if (coverPhotoNew)
            storage.ref(`profile_images/${coverPhotoNew.name}`).put(coverPhotoNew);

        db.collection('profiles').doc(props.match.params.id).update({
            details: details,
            profileInformatio: profileInformatio,
            userName: userName,
            region: region,
            city: city,
            profilePhoto: profilePhotoNew ? profilePhotoNew.name : profilePhoto,
            coverPhoto: coverPhotoNew ? coverPhotoNew.name : coverPhoto
        }).then(() => {
            setLoad(0);
            console.log("Sucess");
        }).catch((error) => {
            setLoad(0);
            console.error("error");
        });
    }

    function enroll() {
        setLoad(1);
        let save;
        if (!isEmpty(profilePhotoNew)) {
            save = storage.ref(`profile_images/${profilePhotoNew.name}`).put(profilePhotoNew);
            if (!isEmpty(coverPhotoNew)) {
                save = storage.ref(`profile_images/${coverPhotoNew.name}`).put(coverPhotoNew);
            }
        }

        save.then(() => {
            db.collection('profiles').add({
                details: details,
                profileInformatio: profileInformatio,
                userName: userName,
                profilePhoto: profilePhotoNew.name,
                coverPhoto: coverPhotoNew.name,
                emailUser: emailUser,
                region: region,
                city: city,
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
                    <div className="div_main_editprofile">
                        <div className="div__header">
                            <div className="w-100">
                                <h3 className="mx-auto font-weight-bold">Editar Perfil</h3>
                            </div>
                            <div>
                                <ButtonBackhome />
                            </div>
                        </div>
                        <hr />
                        <div>
                            <form className="form">
                                <div className="form-title">
                                    <label className="field_title_label">Nome do perfil*</label>
                                    <input onChange={(e) => setUserName(e.target.value)} value={userName && userName} type="text" className="form-control" placeholder="Adicione um nome ao perfil" />
                                </div>
                                <div className="row">
                                    <div className="form-group">
                                        <div className="form-group">
                                            <label className="field_title_label">Informações de perfil*</label>
                                            <input onChange={(e) => setProfileInformatio(e.target.value)} value={profileInformatio && profileInformatio}
                                                type="text" className="form-control" rows="3" placeholder="Ex.: Professor | Palestrante | etc."></input>
                                        </div>
                                        <div className="form-group">
                                            <label className="field_title_label">Descreva quem é você</label>
                                            <textarea onChange={(e) => setDetails(e.target.value)} value={details && details} className="form-control" rows="3" placeholder="Ex.: profissão, hobby, interesses, currículo acadêmico, etc."></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label className="field_title_label">País/Região*</label>
                                            <input onChange={(e) => setRegion(e.target.value)} value={region && region} type="text" className="form-control" rows="3" placeholder="Ex.: Brasil"></input>
                                        </div>
                                        <div className="form-group">
                                            <label className="field_title_label">Cidade</label>
                                            <input onChange={(e) => setCity(e.target.value)} value={city && city} type="text" className="form-control" rows="3"></input>
                                        </div>
                                    </div>
                                </div>
                                <div className="form">
                                    <label className="field_title_label">Carregar/alterar foto do perfil</label>
                                    <input onChange={(e) => setProfilePhotoNew(e.target.files[0])} type="file" className="form-control" />
                                </div>
                                <div className="form">
                                    <label className="field_title_label">Carregar/alterar imagem de capa</label>
                                    <input onChange={(e) => setCoverPhotoNew(e.target.files[0])} type="file" className="form-control" />
                                </div>
                                <div className="row">
                                    {
                                        firstLogin ? <button className="btn-cancel" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        </button> :
                                            <button onClick={props.match.params.id ? update : enroll} type="button" className="btn-cancel">Cancelar</button>
                                    }
                                    {
                                        load ? <button className="btn-cadastro" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        </button> :
                                            <button onClick={props.match.params.id ? update : enroll} type="button" className="btn-cadastro">Salvar alterações</button>
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
//<Modal isOpen={true}>
