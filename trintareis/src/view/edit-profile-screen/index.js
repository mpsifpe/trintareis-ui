import './edit_profile_screen.css';
import React, { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';

import api from '../../config/api';
import firebase from '../../config/firebase';
import { delay, isEmpty } from '../../helpers/helper';
import CountrySelector from '../../components/country-selector/countrySelector';
import loading from '../../resources/loading.gif';
import NotyfContext from '../../components/notyf-toast/NotyfContext';


export default function EditProfileScreen(){
    const dispatch = useDispatch();
    const notyf = useContext(NotyfContext);
    let location = useLocation();

    const [userData, setUserData]=useState({
            userName: location.state.userData.userName,
            profileInformation: location.state.userData.profileInformation,
            details: location.state.userData.details,
            region: location.state.userData.region,
            city: location.state.userData.city,
            coverPhoto: location.state.coverPhoto,
            profilePhoto: location.state.profilePhoto   });
    
    const [profilePhotoNew, setProfilePhotoNew] = useState("");
    const [coverPhotoNew, setCoverPhotoNew] = useState("");

    const [loginRedirect, setLoginRedirect] = useState(null);
    const [saveButton, setSaveButton] = useState("Salvar");    
    const [cancelButton, setCancelButton] = useState(<button type="button" className="w-100 btn btn-cancelar fw-bold bor"/>);
    const [titleText, setTitleText] = useState( <div><h3>Carregando...</h3></div> );

    const emailUser = useSelector(state => state.emailUser);
    const storage = firebase.storage();
    let profileImageName, coverImageName = ""

    useEffect(() => {
        let abortController = new AbortController();

        if(!location.state.firstLogin){
            setTitleText("Editar perfil")
            setCancelButton(
                <button  type="button" className="w-100 btn btn-cancelar fw-bold bor" 
                        onClick={() => 
                            setLoginRedirect(
                                    <Redirect to={{ 
                                        pathname: '/profile', 
                                        state: {
                                            firstLogin: location.state.firstLogin, 
                                            profilePhoto: location.state.profilePhoto, 
                                            coverPhoto: location.state.coverPhoto, 
                                            userData: location.state.userData 
                                        }}}/>)}>Cancelar
                </button>);
            
            api.get('/profile/' + emailUser)
            .then(function (response) {
                setUserData({
                    id: response.data.id,
                    userName: response.data.userName,
                    profileInformation: response.data.profileInformation,
                    details: response.data.details,
                    region: response.data.region,
                    city: response.data.city,
                    coverPhoto: response.data.coverPhoto,
                    profilePhoto: response.data.profilePhoto            })
            })
            .catch(function (error) {
                console.log(error)
                notyf.error("Desculpe, ocorreu um erro. Favor tentar novamente mais tarde")
                setLoginRedirect(
                    <Redirect to={{ 
                        pathname: '/profile', 
                        state: {
                            firstLogin: location.state.firstLogin, 
                            profilePhoto: location.state.profilePhoto, 
                            coverPhoto: location.state.coverPhoto, 
                            userData: location.state.userData 
                        }}}
                    />)
            })
        
        } else {
            setCancelButton(<button onClick={logoutBtnClick} className="w-100 btn btn-cancelar fw-bold bor">Sair</button>)
            setTitleText("Por favor nos informe alguns dados para prosseguir")
            setUserData({
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
        console.log("put update")

        api.put('/profile/update', {
            "id": userData.id,
            "city": userData.city,
            "details": userData.details,
            "coverPhoto": coverImageName,
            "profileInformation": userData.profileInformation,
            "profilePhoto": profileImageName,
            "emailUser": emailUser,
            "region": userData.region,
            "userName": userData.userName
        })
        .then(function (response) {
            console.log(response)
            if (response.status === 201){
                notyf.success("Perfil editado com sucesso!")
                delay(2000)
            }
        })
        .catch(function (error) {
            console.log(error)
            notyf.error("Ocorreu um erro, favor tente novamente")
            setSaveButton("Salvar");  
        })
        .finally(()=>{
            setLoginRedirect(
                <Redirect to={{ 
                    pathname: '/home', 
                    state: {
                        firstLogin: location.state.firstLogin, 
                        profilePhoto: profileImageName, 
                        coverPhoto: coverImageName, 
                        userData: userData 
                    }}}
                />
            )}
        )
    }

    function postCreateProfile() {
        console.log("post create")

        api.post('/profile/create', {
            "city": userData.city,
            "details": userData.details,
            "coverPhoto": coverImageName,
            "profileInformation": userData.profileInformation,
            "profilePhoto": profileImageName,
            "emailUser": emailUser,
            "region": userData.region,
            "userName": userData.userName
        })
        .then(function (response) {  
            console.log(response)  
            if (response.status === 201){
                notyf.success("Perfil criado com sucesso!")
                delay(2000)
            }
        })
        .catch(function (error) {
            console.log(error)
            notyf.error("Ocorreu um erro, favor tente novamente");
            setSaveButton("Salvar");
        })
        .finally(()=>{
            setLoginRedirect(
                <Redirect to={{ 
                    pathname: '/home', 
                    state: {
                        firstLogin: false, 
                        profilePhoto: profileImageName, 
                        coverPhoto: coverImageName, 
                        userData: userData 
                    }}}
                />
            )}
        )
    }

    function saveBtnClick(){
        if(isEmpty(userData.userName) || isEmpty(userData.profileInformation) || isEmpty(userData.region)){
            notyf.error("Favor preencher os campos obrigatórios"); }
        else {
            setSaveButton(<img src={loading} style={{height: '25px', alignSelf: 'center', opacity: '0.75'}}/>);

            handleProfilePhotoChange();
            handleCoverPhotoChange();
          
            if(location.state.firstLogin){ 
                postCreateProfile() } 
            else { 
                putUpdateProfile() }
            
        }  
    }
   

    function handleProfilePhotoChange(){ 
        
        if(location.state.firstLogin){  
        //----esse bloco insere as fotos na criação do perfil----
            if (!isEmpty(profilePhotoNew)){

                profileImageName = (emailUser + "_profile." + profilePhotoNew.name.split(".").pop())
                
                setUserData({ ...userData, profilePhoto: profileImageName })
                
                storage.ref("profile_images/" + profileImageName).put(profilePhotoNew)
            
            } else { 
                setUserData({ ...userData, profilePhoto: "" })  }

        } else {
        //----esse bloco insere as fotos na edição do perfil----
            //----se já existe foto de profile, exclui a antiga primeiro---
            if (!isEmpty(userData.profilePhoto)){

                if (!isEmpty(profilePhotoNew)){

                    profileImageName = (emailUser + "_profile." + profilePhotoNew.name.split(".").pop())

                    storage.ref("profile_images/" + userData.profilePhoto).delete().then(()=>{
                        setUserData({ ...userData, profilePhoto: profileImageName });
                        storage.ref("profile_images/" + profileImageName).put(profilePhotoNew)
                    })
                    .catch(function (error) {
                        console.log(error);
                        setUserData({ ...userData, profilePhoto: "" });
                        profileImageName = ""
                    })
                } else {
                    profileImageName = userData.profilePhoto
                }   

            } else {
                if (!isEmpty(profilePhotoNew)){

                    profileImageName = (emailUser + "_profile." + profilePhotoNew.name.split(".").pop())
                    
                    setUserData({ ...userData, profilePhoto: profileImageName })

                    storage.ref("profile_images/" + profileImageName).put(profilePhotoNew)
                }
            }
            
        }
        
    }

    function handleCoverPhotoChange(){      
        
        if(location.state.firstLogin){  
        //----esse bloco insere as fotos na criação do perfil----
            if (!isEmpty(coverPhotoNew)){

                coverImageName = (emailUser + "_cover." + coverPhotoNew.name.split(".").pop())

                setUserData({ ...userData, coverPhoto: coverImageName })

                storage.ref("profile_images/" + coverImageName).put(coverPhotoNew)

            } else { 
                setUserData({ ...userData, coverPhoto: "" })  }

        } else {
        //----esse bloco insere as fotos na edição do perfil----
            //----se já existe foto de cover, exclui a antiga primeiro---
            if (!isEmpty(userData.coverPhoto)){
                if (!isEmpty(coverPhotoNew)){

                    coverImageName = (emailUser + "_cover." + coverPhotoNew.name.split(".").pop())

                    storage.ref("profile_images/" + userData.coverPhoto).delete().then(()=>{
                        setUserData({ ...userData, coverPhoto: coverImageName });
                        storage.ref("profile_images/" + coverImageName).put(coverPhotoNew)         
                    }).catch(function (error) {
                        console.log(error);
                        setUserData({ ...userData, coverPhoto: "" });
                        coverImageName=""
                    })
                } else {
                    coverImageName = userData.coverPhoto
                }   
            } else {
                if (!isEmpty(coverPhotoNew)){
                    coverImageName = (emailUser + "_cover." + coverPhotoNew.name.split(".").pop())
                    setUserData({ ...userData, coverPhoto: coverImageName })
                    storage.ref("profile_images/" + coverImageName).put(coverPhotoNew)
                }
            }
        }
        
    }
    
    const handleFieldChange = (event) => { setUserData({ ...userData, [event.target.name]: event.target.value })}
        
    function logoutBtnClick(){
        dispatch({ type: 'LOG_OUT' })
        setLoginRedirect(<Redirect to='/login'/>)    }

    return(
        <div className='background'>
            <div className="div_main_editprofile">
                <h3>{titleText}</h3>
                <hr />
                <div>
                    <form className="form">
                        <div className="form-title">
                            <label className="field_title_label">Nome completo<span style={{color: 'red'}}>*</span></label>
                            <input onChange={handleFieldChange} name="userName" value={getValue(userData.userName)} type="text" className="form-control" placeholder="Nome completo"/>
                        </div>
                        <div className="row">
                            <div className="form-group">
                                <div className="form-group">
                                    <label className="field_title_label">Informações de carreira<span style={{color: 'red'}}>*</span></label>
                                    <input onChange={handleFieldChange} name="profileInformation" value={getValue(userData.profileInformation)} type="text" className="form-control" rows="3" placeholder="Ex.: Estudante, Professor, Palestrante, etc."/>
                                </div>
                                <div className="form-group">
                                    <label className="field_title_label">Descreva quem é você</label>
                                    <textarea onChange={handleFieldChange} name="details" value={getValue(userData.details)} type="text"className="form-control" rows="3" placeholder="Ex.: profissão, hobby, interesses, currículo acadêmico, etc."/>
                                </div>
                                <div className="form-group">
                                    <label className="field_title_label">País<span style={{color: 'red'}}>*</span></label>
                                    <CountrySelector onChange={(e) => setUserData({ ...userData, region: e.target.value})} region={userData.region}/>
                                </div>
                                <div className="form-group">
                                    <label className="field_title_label">Cidade</label>
                                    <input onChange={handleFieldChange} name="city" value={getValue(userData.city)} type="text" className="form-control" rows="1"/>
                                </div>
                            </div>
                        </div>
                        <div className="form">
                            <label className="field_title_label">Carregar/alterar foto do perfil</label>
                            <input onChange={(e) => setProfilePhotoNew(e.target.files[0])} type="file" className="form-control" accept=".jpg, .png, .jpeg, .bmp"/>
                        </div>
                        <div className="form">
                            <label className="field_title_label">Carregar/alterar imagem de capa</label>
                            <input onChange={(e) => setCoverPhotoNew(e.target.files[0])} type="file" className="form-control" accept=".jpg, .png, .jpeg, .bmp"/>
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


function getValue(field){
    if(isEmpty(field)){  return ("");   } 
    else {  return (field);  }
}