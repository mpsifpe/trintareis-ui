import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './editProfile.css';

import firebase from '../../config/firebase';
import { useSelector } from 'react-redux';
import ButtonBackhome from '../../components/button-backEditProfile';

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
    const [friendsList, setFriendsList] = useState({});
    const emailUser = useSelector(state => state.emailUser);

    const storege = firebase.storage();
    const db = firebase.firestore();

    useEffect(() => {
        let abortController = new AbortController();

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
            storege.ref(`profile_images/${profilePhotoNew.name}`).put(profilePhotoNew);

        if (coverPhotoNew)
            storege.ref(`profile_images/${coverPhotoNew.name}`).put(coverPhotoNew);

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
            save = storege.ref(`profile_images/${profilePhotoNew.name}`).put(profilePhotoNew);
            if (!isEmpty(coverPhotoNew)) {
                save = storege.ref(`profile_images/${coverPhotoNew.name}`).put(coverPhotoNew);
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
                dataTime: new Date(),
                friends: friendsList
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
                        <hr />
                        <div>
                            <form className="form">
                                <div className="form-title">
                                    <label>Nome do perfil*</label>
                                    <input onChange={(e) => setUserName(e.target.value)} value={userName && userName} type="text" className="form-control" placeholder="Adicione um nome ao perfil" />
                                </div>
                                <div className="row">
                                    <div className="form-group">
                                        <div className="form-group">
                                            <label>Informações de perfil*</label>
                                            <input onChange={(e) => setProfileInformatio(e.target.value)} value={profileInformatio && profileInformatio}
                                                type="text" className="form-control" rows="3" placeholder="Ex.: Professor | Palestrante | etc."></input>
                                        </div>
                                        <div className="form-group">
                                            <label>Descrevar quem é você</label>
                                            <textarea onChange={(e) => setDetails(e.target.value)} value={details && details} className="form-control" rows="3" placeholder="Ex.: profissão, hobby, interesses, currículo acadêmico, etc."></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label>País/Região*</label>
                                            <input onChange={(e) => setRegion(e.target.value)} value={region && region} type="text" className="form-control" rows="3" placeholder="Ex.: Brasil"></input>
                                        </div>
                                        <div className="form-group">
                                            <label>Cidade</label>
                                            <input onChange={(e) => setCity(e.target.value)} value={city && city} type="text" className="form-control" rows="3"></input>
                                        </div>
                                    </div>
                                </div>
                                <div className="form">
                                    <label>Carregar foto do perfil {props.match.params.id ? '(Caso queira manter a mesma foto, não precisa escolher uma nova imagem)' : null}</label>
                                    <input onChange={(e) => setProfilePhotoNew(e.target.files[0])} type="file" className="form-control" />
                                </div>
                                <div className="form">
                                    <label>Carregar imagem da capa  {props.match.params.id ? '(Caso queira manter a mesma foto, não precisa escolher uma nova imagem)' : null}</label>
                                    <input onChange={(e) => setCoverPhotoNew(e.target.files[0])} type="file" className="form-control" />
                                </div>
                                <div className="row">
                                    {
                                        load ? <button className="form-control btn btn-lg btn-block mt-3 mb-5 btn-cadastro" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        </button> :
                                            <button onClick={props.match.params.id ? update : enroll} type="button" className="form-control btn btn-lg btn-block mt-3 mb-5 btn-cadastro">Salvar alterações</button>
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