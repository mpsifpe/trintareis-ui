import './edit_profile_screen.css';
import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useStateIfMounted } from 'use-state-if-mounted';

import firebase from '../../config/firebase';
import { hasProfile, getProfileData } from '../../helpers/profile-helper';
import { isEmpty } from '../../helpers/helper';
import NotyfContext from '../../components/notyf-toast/NotyfContext';


export default function EditProfileScreen(props){
    
    const notyf = useContext(NotyfContext);

    const [loaded, setLoaded] = useState(false)
    //const [data, setData] = useState([]);
    const [details, setDetails] = useState("");
    const [profileInformation, setProfileInformation] = useState("");
    const [userName, setUserName] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [profilePhotoNew, setProfilePhotoNew] = useState(null);
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [coverPhotoNew, setCoverPhotoNew] = useState(null);
    const [region, setRegion] = useState("");
    const [city, setCity] = useState("");
    const [firstLogin, setFirstLogin] = useState();
    
    const [cancelButton, setCancelButton] = useStateIfMounted(<button onClick={cancelBtnClick} type="button" className="btn-cancelar">Cancelar</button>);
    const [saveButton, setSaveButton] = useStateIfMounted(<button onClick={saveBtnClick} type="button" className="btn-salvar">Salvar</button>);
    const [titleText, setTitleText] = useState(
            <div>
                <h3>Carregando</h3>
            </div>
    );
    
    const emailUser = useSelector(state => state.emailUser);
    const storage = firebase.storage();
    const profiles = firebase.firestore().collection('profiles');
    let data;

    useEffect(() => {
        let abortController = new AbortController();
        
        if (!hasProfile(emailUser)){
            setFirstLogin(false)
            setTitleText(
                <div>
                    <h3>Editar perfil</h3>
                </div>
            )
        }
        else{
            setFirstLogin(true)
            setTitleText(
                <div>
                    <h3>Seja bem-vindo! Por favor nos informe alguns dados para prosseguir</h3>
                </div>
            );
        }

        data = getProfileData(emailUser, data);
            
        if(!loaded && !isEmpty(data)){
            console.log(data)
            setCity(data.data.city);
            setDetails(data.data.details);
            setProfileInformation(data.data.profileInformation);
            setRegion(data.data.region);
            setUserName(data.data.userName);
            setLoaded(true); 


            if(props.match.params.id){
                profiles.doc(props.match.params.id).get().then(async (result) => {
                    setProfilePhoto(result.data().profilePhoto);
                    setCoverPhoto(result.data().coverPhoto);
                })
            }
        }

        return function cleanup() {
            abortController.abort()
        }
    },[]);

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
            notyf.error("error");
        } else {
            notyf.error("cancelei");
        }
    }
    

    function update() {
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
            
            console.log("Sucess");
        }).catch((error) => {
            
            console.error("error");
        });
    }

    function enroll() {
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
                
                console.log("Document written with ID: ", docRef.id);
            }).catch((error) => {
                
                console.error("Error adding document: ", error);
            });
        });
    }

    return(
        <div>
            <div className="div_main_editprofile">
                {titleText}
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
                                    <label className="field_title_label">Informações de carreira*</label>
                                    <input onChange={(e) => setProfileInformation(e.target.value)} value={profileInformation && profileInformation}
                                        type="text" className="form-control" rows="3" placeholder="Ex.: Estudante, Professor, Palestrante, etc."></input>
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
                    </form>
                </div>
            </div>
        </div>
    )
}