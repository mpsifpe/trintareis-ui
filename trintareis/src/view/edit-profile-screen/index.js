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

    const [redirect, setRedirect] = useState(null);
    const [saveButton, setSaveButton] = useState("Salvar");    
    const [cancelButton, setCancelButton] = useState(<button type="button" className="w-100 btn btn-cancelar fw-bold bor"/>);
    const [deleteProfilePhotoButton, setDeleteProfilePhotoButton] = useState(<></>)
    const [titleText, setTitleText] = useState( <div><h3>Carregando...</h3></div> );
    const [photoText, setPhotoText] = useState("Carregar foto de perfil");
    const [coverText, setCoverText] = useState("Carregar imagem de capa");

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
                            setRedirect(
                                    <Redirect to={{ 
                                        pathname: '/profile/' + location.state.userData.id, 
                                        state: {
                                            firstLogin: location.state.firstLogin, 
                                            profilePhoto: location.state.profilePhoto, 
                                            coverPhoto: location.state.coverPhoto, 
                                            userData: location.state.userData 
                                        }}}/>)}>Cancelar
                </button>);
            
            api.get('/profile/' + emailUser)
            .then(function (response) {
                console.log(response)
                console.log("profile foto>>>", response.data.profilePhoto)

                if (!isEmpty(response.data.profilePhoto)){
                    setPhotoText("Trocar foto de perfil");
                    setDeleteProfilePhotoButton(<button onClick={()=>{deletePhotoClick("profilePhoto")}} type="button" className="w-100 btn btn-salvar fw-bold bor">Apagar</button>);
                }
                
                if (!isEmpty(response.data.coverPhoto)){
                    setCoverText("Trocar imagem de capa");
                    //setDeleteProfilePhotoButton(<button onClick={()=>{deletePhoto("profilePhoto")}} type="button" className="w-100 btn btn-salvar fw-bold bor">Apagar</button>);
                }

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
                setRedirect(
                    <Redirect to={{ 
                        pathname: '/profile/' + location.state.userData.id, 
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
   
    function handleProfilePhotoChange(image){ 

        if(!location.state.firstLogin){    
            
            // perfil sem profilePhoto
            if (isEmpty(userData.profilePhoto)){

                profileImageName = (emailUser + "_profile." + image.name.split(".").pop());
                
                storage.ref("profile_images/" + profileImageName).put(image)
                    .then(()=>{
                        storage.ref("profile_images/" + profileImageName).getDownloadURL()
                            .then((url)=>{
                                setUserData({ ...userData, profilePhoto: url });
                            });

                    })
                    .catch((error) => {
                        console.log("Erro ao carregar profilePhoto - ");
                        console.log(error);
                        notyf.error("Desculpe, ocorreu um erro ao atualizar sua foto do perfil");
                    })

            // perfil com profilePhoto
            } else {
                
                //----nova foto selecionada, exclui a antiga primeiro para depois subir a nova
                //----para deletar a foto será exibido um botão específico
                profileImageName = (emailUser + "_profile." + image.name.split(".").pop())

                storage.refFromURL(userData.profilePhoto).delete().then(()=>{
                    
                    //----se delete com sucesso, url é apagada do userData e nova imagem é carregada
                    setUserData({ ...userData, profilePhoto: "" });
                    
                    storage.ref("profile_images/" + profileImageName).put(image)
                        .then(()=>{
                            storage.ref("profile_images/" + profileImageName).getDownloadURL()
                                .then((url)=>{
                                    setUserData({ ...userData, profilePhoto: url });
                                });
                        })
                        .catch((error) => {
                            console.log("Erro ao carregar profilePhoto - ");
                            console.log(error);
                            notyf.error("Desculpe, ocorreu um erro ao atualizar sua foto do perfil");
                        })

                })
                .catch(function (error) {
                    //----caso ocorra erro no delete, a url permanecerá no userData
                    console.log(">>>Erro ao deletar profilePhoto");
                    console.log(error);
                    notyf.error("Desculpe, ocorreu um erro ao atualizar sua foto do perfil");
                })
            }
        }
    }

    function handleCoverPhotoChange(){      
        /*
        if(location.state.firstLogin){  
        //----esse bloco insere as fotos na criação do perfil----
            if (!isEmpty(coverPhotoNew)){

                coverImageName = (emailUser + "_cover." + coverPhotoNew.name.split(".").pop())

                setUserData({ ...userData, coverPhoto: coverImageName })

                storage.ref("profile_images/" + coverImageName).put(coverPhotoNew)
                .then(()=>{ updateRef("coverPhoto", coverImageName) })

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
                        .then(()=>{ updateRef("coverPhoto", coverImageName) })

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
                    .then(()=>{ updateRef("coverPhoto", coverImageName) })
                }
            }
        }
        */
    }

    function putUpdateProfile(){
        console.log("put update");
        delay(3000);

        api.put('/profile/update', {
            "id": userData.id,
            "city": userData.city,
            "details": userData.details,
            "coverPhoto": userData.coverPhoto,
            "profileInformation": userData.profileInformation,
            "profilePhoto": userData.profilePhoto,
            "emailUser": emailUser,
            "region": userData.region,
            "userName": userData.userName
        })
        .then(function (response) {
            console.log(response)

            if (response.status === 201){
                notyf.success("Perfil editado com sucesso!")
                setRedirect(
                    <Redirect to={{ 
                        pathname: '/home', 
                        state: {
                            firstLogin: false, 
                            profilePhoto: userData.profilePhoto,
                            coverPhoto: userData.coverPhoto, 
                            userData: userData 
                        }}}
                    />
                )
            }
        })
        .catch(function (error) {
            console.log(error)
            notyf.error("Ocorreu um erro, favor tente novamente")
            setSaveButton("Salvar");
        })
    }

    function postCreateProfile() {
        console.log("post create")

        api.post('/profile/create', {
            "city": userData.city,
            "details": userData.details,
            "coverPhoto": "",
            "profileInformation": userData.profileInformation,
            "profilePhoto": "",
            "emailUser": emailUser,
            "region": userData.region,
            "userName": userData.userName
        })
        .then(function (response) {  
            console.log(response)

            if (response.status === 201){
                delay(5000);
                notyf.success("Perfil criado com sucesso!");

                setRedirect(
                    <Redirect to={{ 
                        pathname: '/home', 
                        state: {
                                firstLogin: false,
                                profilePhoto: userData.profilePhoto, 
                                coverPhoto: userData.coverPhoto, 
                                userData: userData 
                               }}}
                    />
                )
            }
        })
        .catch(function (error) {
            console.log(error)
            notyf.error("Ocorreu um erro, favor tente novamente");
            setSaveButton("Salvar");
        })
    }

    function saveBtnClick(){
        if(saveButton === "Salvar"){
            if(isEmpty(userData.userName) || isEmpty(userData.profileInformation) || isEmpty(userData.region)){
                notyf.error("Favor preencher os campos obrigatórios"); }
            else {
                setSaveButton(<img src={loading} style={{height: '25px', alignSelf: 'center', opacity: '0.75'}} alt="loading"/>);

                handleProfilePhotoChange();
                //handleCoverPhotoChange();
                
                if(location.state.firstLogin){ 
                    postCreateProfile() } 
                else { 
                    putUpdateProfile() }
                
            }
        }
    }

    function deletePhotoClick(type){
        
        if(type === "profilePhoto"){
            setDeleteProfilePhotoButton(<button type="button" className="w-100 btn btn-salvar fw-bold bor"><img src={loading} style={{height: '25px', alignSelf: 'center', opacity: '0.75'}} alt="loading"/></button>);
                
            storage.refFromURL(userData.profilePhoto).delete().then(()=>{
                setDeleteProfilePhotoButton(<></>);
                notyf.success("Foto de perfil apagada com sucesso");
            })
            .catch(function (error) {
                console.log(">>>Erro ao deletar coverPhoto");
                console.log(error);
                notyf.error("Desculpe, ocorreu um erro ao apagar sua foto");
                setDeleteProfilePhotoButton(<button onClick={()=>{deletePhotoClick("profilePhoto")}} type="button" className="w-100 btn btn-salvar fw-bold bor">Apagar</button>);
            })
        }
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
                            <input onChange={handleFieldChange} name="userName" value={getValue(userData.userName)} type="text" className="form-control" placeholder="Nome completo"/>
                        </div>
                        <div className="row">
                            <div className="form-group">
                                <div className="form-group">
                                    <label className="field_title_label">Profissão<span style={{color: 'red'}}>*</span></label>
                                    <input onChange={handleFieldChange} name="profileInformation" value={getValue(userData.profileInformation)} type="text" className="form-control" rows="3" placeholder="Ex.: Estudante, Professor, Engenheiro, etc"/>
                                </div>
                                <div className="form-group">
                                    <label className="field_title_label">Descreva quem é você</label>
                                    <textarea onChange={handleFieldChange} name="details" value={getValue(userData.details)} type="text"className="form-control" rows="3" placeholder="Ex.: Formação, hobby, interesses, currículo acadêmico, etc"/>
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
                            <label className="field_title_label">{photoText}</label>
                            <input onChange={(e) => handleProfilePhotoChange(e.target.files[0])} type="file" className="form-control" accept=".jpg, .png, .jpeg, .bmp"/>
                            {deleteProfilePhotoButton}
                        </div>
                        <div className="form">
                            <label className="field_title_label">{coverText}</label>
                            <input onChange={(e) => setCoverPhotoNew(e.target.files[0])} type="file" className="form-control" accept=".jpg, .png, .jpeg, .bmp"/>
                        </div>
                        <div className="div_buttons_row">
                            <div className="div_buttons_center">
                                {cancelButton}
                                <button onClick={saveBtnClick} type="button" className="w-100 btn btn-salvar fw-bold bor">{saveButton}</button>
                            </div>
                        </div>
                    </form>
                    {redirect}
                </div>
            </div>
        </div>
    )
    
    function handleFieldChange(event){
        setUserData({ ...userData, [event.target.name]: event.target.value })}
       
    function logoutBtnClick(){
        dispatch({ type: 'LOG_OUT' })
        setRedirect(<Redirect to='/login'/>)    }
    
    function getValue(field){
        if(isEmpty(field)){  return ("");   } 
        else {  return (field);  }
    }
}


