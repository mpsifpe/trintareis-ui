import './edit_profile_screen.css';
import React, { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';

import api from '../../config/api';
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

    const [redirect, setRedirect] = useState(null);
    const [saveButton, setSaveButton] = useState("Salvar");    
    const [cancelButton, setCancelButton] = useState(<button type="button" className="w-50 btn btn-cancelar fw-bold bor"/>);
    const [titleText, setTitleText] = useState( <div><h3>Carregando...</h3></div> );

    const emailUser = useSelector(state => state.emailUser);

    useEffect(() => {
        let abortController = new AbortController();

        if(!location.state.firstLogin){
            setTitleText("Editar perfil")
            setCancelButton(
                <button  type="button" className="w-50 btn btn-cancelar fw-bold bor"
                        onClick={() => 
                            setRedirect(
                                    <Redirect to={{ 
                                        pathname: '/profile/' + location.state.userData.id, 
                                        state: {
                                            firstLogin: location.state.firstLogin, 
                                            profilePhoto: location.state.profilePhoto, 
                                            coverPhoto: location.state.coverPhoto, 
                                            userData: location.state.userData,
                                            origin:"edit-profile-screen" 
                                        }}}/>)}>Cancelar
                </button>);
            
            api.get('/profile/' + emailUser)
            .then(function (response) {
                console.log(response)

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
                            userData: location.state.userData,
                            origin:"edit-profile-screen"
                        }}}
                    />)
            })
        
        } else {
            setCancelButton(<button onClick={logoutBtnClick} className="w-50 btn btn-cancelar fw-bold bor" >Sair</button>)
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
            "userName": userData.userName,
            "profileType":"PERSONAL"
        })
        .then(function (response) {
            console.log("sucesso")

            if (response.status === 201){
                notyf.success("Perfil editado com sucesso!")
                setRedirect(
                    <Redirect to={{ 
                        pathname: '/home', 
                        state: {
                            firstLogin: false, 
                            profilePhoto: userData.profilePhoto,
                            coverPhoto: userData.coverPhoto, 
                            userData: userData,
                            origin:"edit-profile-screen"
                        }}}
                    />
                )
            }
        })
        .catch(function (error) {
            console.log(error.status)
            notyf.error("Ocorreu um erro, favor tente novamente")
            setSaveButton("Salvar");
        })
    }

    function postCreateProfile() {
        console.log("post create")
        console.log(userData)
        
        api.post('/profile/create', {
            "city": userData.city,
            "details": userData.details,
            "coverPhoto": "",
            "profileInformation": userData.profileInformation,
            "profilePhoto": "",
            "emailUser": emailUser,
            "region": userData.region,
            "userName": userData.userName,
            "profileType":"PERSONAL"
        })
        .then(function (response) {  
            console.log("sucesso")

            if (response.status === 201){
                delay(5000);
                notyf.success("Perfil criado com sucesso!");

                setRedirect(
                    <Redirect to={{ 
                        pathname: '/home', 
                        state: {
                                firstLogin: false,
                                profilePhoto: "", 
                                coverPhoto: "", 
                                userData: userData,
                                origin:"edit-profile-screen"
                               }}}
                    />
                )
            }
        })
        .catch(function (error) {
            console.log(error.status)
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
                
                if(location.state.firstLogin){ 
                    postCreateProfile() } 
                else { 
                    putUpdateProfile() }
                
            }
        }
    }

    return(
        <div className='background'>
            <div className="div_main_editprofile">
                <h3>{titleText}</h3>
                <hr />
                <form className="form">
                    <div className="row">
                        <div className="form-group">
                            <div className="form-group">
                                <label className="field_title_label">Nome<span style={{color: 'red'}}>*</span></label>
                                <input onChange={handleFieldChange} name="userName" value={getValue(userData.userName)} type="text" className="form-control" placeholder="Nome completo"/>
                            </div>
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
                    <div className="div_buttons_row">
                        <div className="div_buttons_center">
                            {cancelButton}
                            <button onClick={saveBtnClick} type="button" className="w-50 btn btn-salvar fw-bold bor">{saveButton}</button>
                        </div>
                    </div>
                </form>
                {redirect}
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


