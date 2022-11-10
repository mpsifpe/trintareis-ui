import './edit_profile_screen.css';
import React, { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';

import api from '../../config/api';
import firebase from '../../config/firebase';
import { isEmpty } from '../../helpers/helper';
import CountrySelector from '../../components/country-selector/countrySelector';
import loading from '../../resources/loading.gif';
import NotyfContext from '../../components/notyf-toast/NotyfContext';


export default function EditProfileScreen(props){
    const dispatch = useDispatch();
    const notyf = useContext(NotyfContext);
    let location = useLocation();

    const [data, setData]=useState({
            userName: "",
            profileInformation: "",
            details: "",
            region: "",
            city:""
        });
    
    const [profilePhoto, setProfilePhoto] = useState("");
    const [profilePhotoNew, setProfilePhotoNew] = useState("");
    const [coverPhoto, setCoverPhoto] = useState("");
    const [coverPhotoNew, setCoverPhotoNew] = useState("");

    const [firstLogin, setFirstLogin] = useState();
    const [loginRedirect, setLoginRedirect] = useState(null);
    const [saveButton, setSaveButton] = useState("Salvar");    
    const [cancelButton, setCancelButton] = useState(<button onClick={() => setLoginRedirect(<Redirect to={{ pathname: '/profile', state: { firstLogin: location.state.firstLogin }}}/>)} type="button" className="w-100 btn btn-cancelar fw-bold bor"/>);
    

    
    const [titleText, setTitleText] = useState(
            <div>
                <h3>Carregando...</h3>
            </div>
    );

    const emailUser = useSelector(state => state.emailUser);
    const storage = firebase.storage();
    const profiles = firebase.firestore().collection('profiles');

    useEffect(() => {
        let abortController = new AbortController();
        
        //alert("first login " + location.state.firstLogin)

        if(!location.state.firstLogin){
            setFirstLogin(false)
            setTitleText("Editar perfil")
            setCancelButton(<button onClick={() => setLoginRedirect(<Redirect to={{ pathname: '/profile', state: { firstLogin: location.state.firstLogin }}}/>)} type="button" className="w-100 btn btn-cancelar fw-bold bor">Cancelar</button>);
            
            api.get('/profile/' + emailUser)
            .then(function (response) {
                setData({
                    userName: response.data.userName,
                    profileInformation: response.data.profileInformation,
                    details: response.data.details,
                    region: response.data.region,
                    city:response.data.city,
                    coverPhoto: data.coverPhoto,
                    profilePhoto: data.profilePhoto            })

                if(props.match.params.id){
                    profiles.doc(props.match.params.id).get().then(async (result) => {
                        setProfilePhoto(result.data().profilePhoto)
                        setCoverPhoto(result.data().coverPhoto)                })}
            })
            .catch(function (error) {
                //console.log(error)
                notyf.error("Desculpe, ocorreu um erro. Favor tentar novamente mais tarde")
                setLoginRedirect(<Redirect to={{ pathname: '/profile', state: { firstLogin: firstLogin }}}/>)
            })
        }else{
            setFirstLogin(true)
            setCancelButton(<button onClick={logoutBtnClick} className="w-100 btn btn-cancelar fw-bold bor">Sair</button>)
            setTitleText("Por favor nos informe alguns dados para prosseguir")

            setData({
                userName: "",
                profileInformation: "",
                details: "",
                region: "",
                city: "",
                coverPhoto: "",
                profilePhoto: ""           })
        }


        return function cleanup() {
            abortController.abort()
        }
    },[]);
   

    function putUpdateProfile(){

        api.put('/profile', {
            "city": data.city,
            "details": data.details,
            "coverPhoto": data.coverPhoto,
            "profileInformation": data.profileInformation,
            "profilePhoto": data.profilePhoto,
            "emailUser": emailUser,
            "region": data.region,
            "userName": data.userName
        })
        .then(function (response) {
            if (response.status === 201){
                notyf.success("Perfil criado com sucesso!")
                setLoginRedirect(<Redirect to={{ pathname: '/home', state: { firstLogin: firstLogin }}}/>)
            }
        })
        .catch(function (error) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            notyf.error("Ocorreu um erro, favor tente novamente")
            setSaveButton("Salvar");  
        });
    }

    function postCreateProfile() {
        
        api.post('/profile', {
            "city": data.city,
            "details": data.details,
            "coverPhoto": data.coverPhoto,
            "profileInformation": data.profileInformation,
            "profilePhoto": data.profilePhoto,
            "emailUser": emailUser,
            "region": data.region,
            "userName": data.userName
        })
        .then(function (response) {

            if (response.status === 201){
                notyf.success("Perfil criado com sucesso!")
                setLoginRedirect(<Redirect to={{ pathname: '/home', state: { firstLogin: firstLogin }}}/>)
            }
        })
        .catch(function (error) {
            //console.log(error);
            notyf.error("Ocorreu um erro, favor tente novamente");
            setSaveButton("Salvar");
        })
    }

    function saveBtnClick(){

        if(isEmpty(data.userName) || isEmpty(data.profileInformation) || isEmpty(data.region)){
            notyf.error("Favor preencher os campos obrigatórios");  }
        else {
            setSaveButton(<img src={loading} style={{height: '25px', alignSelf: 'center'}}/>)
            firstLogin ? postCreateProfile() : putUpdateProfile();      } 
            
            /*
            if (profilePhotoNew){
                        storage.ref(`profile_images/${profilePhotoNew.name}`).put(profilePhotoNew)}
        
                    if (coverPhotoNew){
                        storage.ref(`profile_images/${coverPhotoNew.name}`).put(coverPhotoNew)}*/
    }
    
    function logoutBtnClick(){
        dispatch({ type: 'LOG_OUT' })
        setLoginRedirect(<Redirect to='/login'/>)
    }

    const handleFieldChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value })
    }

    return(
        <div className='background'>
            <div className="div_main_editprofile">
                <h3>{titleText}</h3>
                <hr />
                <div>
                    <form className="form">
                        <div className="form-title">
                            <label className="field_title_label">Nome completo<span style={{color: 'red'}}>*</span></label>
                            <input  onChange={handleFieldChange}
                                    name="userName" value={data.userName} type="text" 
                                    className="form-control" placeholder="Nome completo"/>
                        </div>
                        <div className="row">
                            <div className="form-group">
                                <div className="form-group">
                                    <label className="field_title_label">Informações de carreira<span style={{color: 'red'}}>*</span></label>
                                    <input      onChange={handleFieldChange} 
                                                name="profileInformation" value={data.profileInformation} type="text" 
                                                className="form-control" rows="3" placeholder="Ex.: Estudante, Professor, Palestrante, etc."/>
                                </div>
                                <div className="form-group">
                                    <label className="field_title_label">Descreva quem é você</label>
                                    <textarea   onChange={handleFieldChange} 
                                                name="details" value={data.details} type="text"
                                                className="form-control" rows="3" placeholder="Ex.: profissão, hobby, interesses, currículo acadêmico, etc."/>
                                </div>
                                <div className="form-group">
                                    <label className="field_title_label">País<span style={{color: 'red'}}>*</span></label>
                                    <CountrySelector onChange={(e) => setData({ ...data, region: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label className="field_title_label">Cidade</label>
                                    <input      onChange={handleFieldChange} 
                                                name="city" value={data.city} type="text" 
                                                className="form-control" rows="1"/>
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
                            <div className="div_buttons_center">
                                {cancelButton}
                                <button onClick={saveBtnClick} type="button" className="w-100 btn btn-salvar fw-bold bor">{saveButton}</button>
                            </div>
                        </div>
                    </form>
                    {loginRedirect}
                </div>
            </div>
        </div>
    )
}


/*

<input      onChange={handleFieldChange}
                                                name="region" value={data.region} type="text" 
                                                className="form-control" rows="1" placeholder="Ex.: Brasil"/>

                                                */