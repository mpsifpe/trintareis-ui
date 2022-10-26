import './edit_profile_screen.css';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useStateIfMounted } from 'use-state-if-mounted';

import firebase from '../../config/firebase';
import { hasProfile, getProfileDataByEmail } from '../../helpers/profile-helper';
import api from '../../config/api';


export default function EditProfileScreen(props){
    
    const [load, setLoad] = useStateIfMounted();
    const [details, setDetails] = useStateIfMounted();
    const [profileInformation, setProfileInformation] = useStateIfMounted();
    const [userName, setUserName] = useStateIfMounted();
    const [profilePhoto, setProfilePhoto] = useStateIfMounted();
    const [profilePhotoNew, setProfilePhotoNew] = useStateIfMounted();
    const [coverPhoto, setCoverPhoto] = useStateIfMounted();
    const [coverPhotoNew, setCoverPhotoNew] = useStateIfMounted();
    const [region, setRegion] = useStateIfMounted();
    const [city, setCity] = useStateIfMounted();
    const [firstLogin, setFirstLogin] = useStateIfMounted();
    const [cancelButton, setCancelButton] = useStateIfMounted(<button onClick={cancelBtnClick} type="button" className="btn-cancelar">Cancelar</button>);
    const [saveButton, setSaveButton] = useStateIfMounted(<button onClick={saveBtnClick} type="button" className="btn-salvar">Salvar</button>);
    
    const emailUser = useSelector(state => state.emailUser);
    const storage = firebase.storage();
    const profiles = firebase.firestore().collection('profiles');
    const [test, setTest] = useStateIfMounted(<></>);

    useEffect(() => {
        let abortController = new AbortController();

        if(hasProfile(emailUser)){
            setFirstLogin(true)
        }else{
            setFirstLogin(false)
            let profileData = getProfileDataByEmail(emailUser);
            console.log(getProfileDataByEmail(emailUser))
            /*setCity();
            setDetails();
            setProfileInformation();
            setRegion();
            setUserName();*/
            
        }


        if(props.match.params.id){
            profiles.doc(props.match.params.id).get().then(async (result) => {
                setProfilePhoto(result.data().profilePhoto);
                setCoverPhoto(result.data().coverPhoto);
                setDetails(result.data().details);
                setProfileInformation(result.data().profileInformatio);
                setUserName(result.data().userName);
                setRegion(result.data().region);
                setCity(result.data().city);
            })
        }

        return function cleanup() {
            abortController.abort()
        }
    }, []);



    function saveBtnClick(){
        if(isEmpty(userName) || isEmpty(profileInformation) || isEmpty(region)){
            console.error("error: campos obrigatórios em branco");
        }
        else {
            if(firstLogin){
                enroll();
            } else {
                update();
            }
        }
    }

    function cancelBtnClick(){
        if( firstLogin || isEmpty(userName) || isEmpty(profileInformation) || isEmpty(region)){
            console.error("name " + userName);
            console.error("infor " + profileInformation);
            console.error("region " + region);
            console.error("error");
        } else {
            console.log("cancelei");
        }
    }
    

    function update() {
        setLoad(1);

        if (profilePhotoNew)
            storage.ref(`profile_images/${profilePhotoNew.name}`).put(profilePhotoNew);

        if (coverPhotoNew)
            storage.ref(`profile_images/${coverPhotoNew.name}`).put(coverPhotoNew);

        profiles.doc(props.match.params.id).update({
            details: details,
            profileInformatio: profileInformation,
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
            save = storage.ref(`profile_images/${profilePhotoNew.name}`).put(profilePhotoNew);        }
        if (!isEmpty(coverPhotoNew)) {
            save = storage.ref(`profile_images/${coverPhotoNew.name}`).put(coverPhotoNew);        }

        save.then(() => {
            profiles.add({
                details: details,
                profileInformatio: profileInformation,
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

    return(
        <div>
            <div className="div_main_editprofile">
                <div>
                    <h3>Editar Perfil</h3>
                </div>
                <hr />
                <div>
                    <form className="form">
                        <div className="form-title">
                            <label className="field_title_label">Nome completo*</label>
                            <input onChange={(e) => setUserName(e.target.value)} value={userName && userName} type="text" className="form-control" placeholder="Nome completo" />

                        </div>
                        <div className="row">
                            <div className="form-group">
                                <div className="form-group">
                                    <label className="field_title_label">Informações de perfil*</label>
                                    <input onChange={(e) => setProfileInformation(e.target.value)} value={profileInformation && profileInformation}
                                        type="text" className="form-control" rows="3" placeholder="Ex.: Professor | Palestrante | etc."></input>
                                </div>
                                <div className="form-group">
                                    <label className="field_title_label">Descreva quem é você</label>
                                    <textarea onChange={(e) => setDetails(e.target.value)} value={details && details} className="form-control" rows="3" placeholder="Ex.: profissão, hobby, interesses, currículo acadêmico, etc."></textarea>
                                </div>
                                <div className="form-group">
                                    <label className="field_title_label">País/Região*</label>
                                    <input onChange={(e) => setRegion(e.target.value)} value={region && region} type="text" className="form-control" rows="1" placeholder="Ex.: Brasil"></input>
                                </div>
                                <div className="form-group">
                                    <label className="field_title_label">Cidade</label>
                                    <input onChange={(e) => setCity(e.target.value)} value={city && city} type="text" className="form-control" rows="1"></input>
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
                        <div className="div_buttons_row">
                            {cancelButton}
                            {saveButton}
                        </div>
                        {test}
                    </form>
                </div>
            </div>
        </div>
    )
}


//auxiliares
function isEmpty(value) {
    return (value == null || value.length === 0);
}