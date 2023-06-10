import './edit_images_screen.css';
import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useLocation, Link } from 'react-router-dom';

import api from '../../config/api';
import firebase from '../../config/firebase';
import { isURL, isEmpty } from '../../helpers/helper';
import loading from '../../resources/loading.gif';
import NotyfContext from '../../components/notyf-toast/NotyfContext';


export default function EditImagesScreen(){
    const notyf = useContext(NotyfContext);
    let location = useLocation();

    const [redirect, setRedirect] = useState(null);
    const [saveButton, setSaveButton] = useState("Salvar");
    const [titleText, setTitleText] = useState("");
    const [imageField, setImageField] = useState(<></>);
    const [newProfileImage, setNewProfileImage] = useState();
    const [newCoverImage, setNewCoverImage] = useState();

    const emailUser = useSelector(state => state.emailUser);
    const storage = firebase.storage();
    let profileImageName, coverImageName = ""

    useEffect(() => {
        let abortController = new AbortController();

        //console.log("profile url>>> " + isURL(location.state.profilePhoto))
        //console.log("cover url>>> " + isURL(location.state.coverPhoto))

        if(location.state.image === "profile"){
            setTitleText("Editar foto do perfil");
            setImageField(
                <div className="container">
                    <input onChange={(e) => setNewProfileImage(e.target.files[0])} type="file" className="w-60 form-control" style={{height:"40px"}} accept=".jpg, .png, .jpeg, .bmp"/>
                    { isEmpty(location.state.profilePhoto) ? <></> :
                      <button onClick={()=>{deletePhotoClick("profilePhoto")}} type="button" className="btn btn-salvar fw-bold bor" style={{height:"40px", width:"fit-content", marginLeft:"5px", marginTop:"-1px"}}>Apagar</button> }
                </div>
            ); 
        } 
        else { 
            setTitleText("Editar foto de capa");
            setImageField(
                <div className="container">
                    <input onChange={(e) => setNewCoverImage(e.target.files[0])} type="file" className="w-60 form-control" style={{height:"40px"}} accept=".jpg, .png, .jpeg, .bmp"/>
                    { isEmpty(location.state.coverPhoto) ? <></> :
                        <button onClick={()=>{deletePhotoClick("coverPhoto")}} type="button" className="btn btn-salvar fw-bold bor" style={{height:"40px", width:"fit-content", marginLeft:"5px", marginTop:"-1px"}}>Apagar</button> }
                </div>
            );
         }

        return function cleanup() {
            abortController.abort()
        }
    },[]);

    return(
        <div className='background'style={{marginTop:"25vh"}}>
            <div className="div_main_editprofile">
                <h3>{titleText}</h3>
                <hr />
                <div>
                    <form className="form">
                        {imageField}
                        <div className="div_buttons_row">
                            <div className="div_buttons_center">
                                <Link to={{ pathname: ('/profile/' + location.state.userData.id), 
                                            state: {
                                                firstLogin: false, 
                                                profilePhoto: location.state.profilePhoto,
                                                coverPhoto: location.state.coverPhoto, 
                                                userData: location.state.userData,
                                                origin: "edit-images-screen-cancel"}}}>
                                    <button type="button" className="w-50 btn btn-cancelar fw-bold bor" style={{height:"45px"}}>Cancelar</button> 
                                </Link>
                                <button onClick={saveBtnClick} type="button" className="w-50 btn btn-salvar fw-bold bor" style={{height:"45px"}}>{saveButton}</button>
                            </div>
                        </div>
                    </form>
                    {redirect}
                </div>
            </div>
        </div>
    )

    //--------------------------------------save button--------------------
    function saveBtnClick(){
        if(saveButton === "Salvar"){
            setSaveButton(<img src={loading} style={{height: '25px', alignSelf: 'center', opacity: '0.75'}} alt="loading"/>);

            if(location.state.image === "profile"){
                handleProfilePhotoChange();
            } else {
                handleCoverPhotoChange();
            }
        }
    }

    //--------------------------------------delete button------------------
    function deletePhotoClick(type){

        setSaveButton(<img src={loading} style={{height: '25px', alignSelf: 'center', opacity: '0.75'}} alt="loading"/>);

        //profilePhoto
        if(type === "profilePhoto"){
            if(isURL(location.state.profilePhoto)){
                storage.refFromURL(location.state.profilePhoto).delete()
                .then(()=>{
                    api.put('/profile/update', {
                        "id": location.state.userData.id,
                        "city": location.state.userData.city,
                        "details": location.state.userData.details,
                        "coverPhoto": location.state.coverPhoto,
                        "profileInformation": location.state.userData.profileInformation,
                        "profilePhoto": "",
                        "emailUser": emailUser,
                        "region": location.state.userData.region,
                        "userName": location.state.userData.userName
                    }).then(()=>{
                        setRedirect(
                            <Redirect to={{ 
                                pathname: ("/profile/" + location.state.userData.id), 
                                state: {
                                    firstLogin: false, 
                                    profilePhoto: "",
                                    coverPhoto: location.state.coverPhoto, 
                                    userData: location.state.userData,
                                    origin: "edit-profile-image-save"
                                }}}
                            />
                        )
                    })
                })
                .catch(function (error) {
                    console.log(">>>Erro ao deletar profilePhoto");
                    console.log(error);
                    notyf.error("Desculpe, ocorreu um erro ao apagar sua foto");
                    setRedirect(
                        <Redirect to={{ 
                            pathname: ("/profile/" + location.state.userData.id),
                            state: {
                                firstLogin: false, 
                                profilePhoto: location.state.profilePhoto,
                                coverPhoto: location.state.coverPhoto, 
                                userData: location.state.userData,
                                origin: "edit-images-screen-error"
                            }}}
                        />
                    )
                })
            }
            else {
                storage.ref("profile_images/" + location.state.profilePhoto).delete()
                .then(()=>{
                    api.put('/profile/update', {
                        "id": location.state.userData.id,
                        "city": location.state.userData.city,
                        "details": location.state.userData.details,
                        "coverPhoto": location.state.coverPhoto,
                        "profileInformation": location.state.userData.profileInformation,
                        "profilePhoto": "",
                        "emailUser": emailUser,
                        "region": location.state.userData.region,
                        "userName": location.state.userData.userName
                    }).then(()=>{
                        setRedirect(
                            <Redirect to={{ 
                                pathname: ("/profile/" + location.state.userData.id), 
                                state: {
                                    firstLogin: false, 
                                    profilePhoto: "",
                                    coverPhoto: location.state.coverPhoto, 
                                    userData: location.state.userData,
                                    origin: "edit-profile-image-save"
                                }}}
                            />
                        )
                    })
                })
                .catch(function (error) {
                    console.log(">>>Erro ao deletar profilePhoto");
                    console.log(error);
                    notyf.error("Desculpe, ocorreu um erro ao apagar sua foto");
                    setRedirect(
                        <Redirect to={{ 
                            pathname: ("/profile/" + location.state.userData.id),
                            state: {
                                firstLogin: false, 
                                profilePhoto: location.state.profilePhoto,
                                coverPhoto: location.state.coverPhoto, 
                                userData: location.state.userData,
                                origin: "edit-images-screen-error"
                            }}}
                        />
                    )
                })
            }
        }

        //coverPhoto
        else{
            if(isURL(location.state.coverPhoto)){
                storage.refFromURL(location.state.coverPhoto).delete()
                .then(()=>{
                    api.put('/profile/update', {
                        "id": location.state.userData.id,
                        "city": location.state.userData.city,
                        "details": location.state.userData.details,
                        "coverPhoto": "",
                        "profileInformation": location.state.userData.profileInformation,
                        "profilePhoto": location.state.profilePhoto,
                        "emailUser": emailUser,
                        "region": location.state.userData.region,
                        "userName": location.state.userData.userName
                    }).then(()=>{
                        setRedirect(
                            <Redirect to={{ 
                                pathname: ("/profile/" + location.state.userData.id), 
                                state: {
                                    firstLogin: false, 
                                    profilePhoto: location.state.profilePhoto,
                                    coverPhoto: "", 
                                    userData: location.state.userData,
                                    origin: "edit-cover-image-save"
                                }}}
                            />
                        )
                    })
                })
                .catch(function (error) {
                    console.log(">>>Erro ao deletar coverPhoto");
                    console.log(error);
                    notyf.error("Desculpe, ocorreu um erro ao apagar sua foto");
                    setRedirect(
                        <Redirect to={{ 
                            pathname: ("/profile/" + location.state.userData.id), 
                            state: {
                                firstLogin: false, 
                                profilePhoto: location.state.profilePhoto,
                                coverPhoto: location.state.coverPhoto, 
                                userData: location.state.userData,
                                origin: "edit-images-screen-error"
                            }}}
                        />
                    )
                })
            }
            else {
                storage.ref("profile_images/" + location.state.coverPhoto).delete()
                .then(()=>{
                    api.put('/profile/update', {
                        "id": location.state.userData.id,
                        "city": location.state.userData.city,
                        "details": location.state.userData.details,
                        "coverPhoto": "",
                        "profileInformation": location.state.userData.profileInformation,
                        "profilePhoto": location.state.profilePhoto,
                        "emailUser": emailUser,
                        "region": location.state.userData.region,
                        "userName": location.state.userData.userName
                    }).then(()=>{
                        setRedirect(
                            <Redirect to={{ 
                                pathname: ("/profile/" + location.state.userData.id), 
                                state: {
                                    firstLogin: false, 
                                    profilePhoto: location.state.profilePhoto,
                                    coverPhoto: "", 
                                    userData: location.state.userData,
                                    origin: "edit-cover-image-save"
                                }}}
                            />
                        )
                    })
                })
                .catch(function (error) {
                    console.log(">>>Erro ao deletar profilePhoto");
                    console.log(error);
                    notyf.error("Desculpe, ocorreu um erro ao apagar sua foto");
                    setRedirect(
                        <Redirect to={{ 
                            pathname: ("/profile/" + location.state.userData.id), 
                            state: {
                                firstLogin: false, 
                                profilePhoto: location.state.profilePhoto,
                                coverPhoto: location.state.coverPhoto, 
                                userData: location.state.userData,
                                origin: "edit-images-screen-error"
                            }}}
                        />
                    )
                })
            }
        }
    }

    //--------------------------------------change profile photo---------------------
    function handleProfilePhotoChange(){ 

        // perfil sem profilePhoto
        if (isEmpty(location.state.profilePhoto)){

            profileImageName = (emailUser + "_profile." + newProfileImage.name.split(".").pop());
            
            storage.ref("profile_images/" + profileImageName).put(newProfileImage)
                .then(()=>{
                    api.put('/profile/update', {
                        "id": location.state.userData.id,
                        "city": location.state.userData.city,
                        "details": location.state.userData.details,
                        "coverPhoto": location.state.coverPhoto,
                        "profileInformation": location.state.userData.profileInformation,
                        "profilePhoto": profileImageName,
                        "emailUser": emailUser,
                        "region": location.state.userData.region,
                        "userName": location.state.userData.userName
                    })
                    .catch(()=>{
                        storage.ref("profile_images/" + profileImageName).delete();
                        notyf.error("Desculpe, ocorreu um erro ao atualizar a imagem");
                        setRedirect(
                            <Redirect to={{ 
                                pathname: ("/profile/" + location.state.userData.id), 
                                state: {
                                    firstLogin: false, 
                                    profilePhoto: location.state.profilePhoto,
                                    coverPhoto: location.state.coverPhoto, 
                                    userData: location.state.userData,
                                    origin: "edit-images-screen-error"
                                }}}
                            />
                        )
                    })
                    .finally(()=>{
                        setRedirect(
                            <Redirect to={{ 
                                pathname: ("/profile/" + location.state.userData.id), 
                                state: {
                                    firstLogin: false, 
                                    profilePhoto: profileImageName,
                                    coverPhoto: location.state.coverPhoto, 
                                    userData: location.state.userData,
                                    origin: "edit-profile-image-save"
                                }}}
                            />
                        )
                    })
                })
                .catch((error) => {
                    console.log("Erro ao carregar profilePhoto - ");
                    console.log(error);
                    notyf.error("Desculpe, ocorreu um erro ao atualizar a imagem");
                    setRedirect(
                        <Redirect to={{ 
                            pathname: ("/profile/" + location.state.userData.id), 
                            state: {
                                firstLogin: false, 
                                profilePhoto: location.state.profilePhoto,
                                coverPhoto: location.state.coverPhoto, 
                                userData: location.state.userData,
                                origin: "edit-images-screen-error"
                            }}}
                        />
                    )
                })

        // perfil com profilePhoto
        } else {
            profileImageName = (emailUser + "_profile." + newProfileImage.name.split(".").pop())

            storage.refFromURL(location.state.profilePhoto).delete().then(()=>{                
                storage.ref("profile_images/" + profileImageName).put(newProfileImage)
                    .then(()=>{
                        api.put('/profile/update', {
                            "id": location.state.userData.id,
                            "city": location.state.userData.city,
                            "details": location.state.userData.details,
                            "coverPhoto": location.state.coverPhoto,
                            "profileInformation": location.state.userData.profileInformation,
                            "profilePhoto": profileImageName,
                            "emailUser": emailUser,
                            "region": location.state.userData.region,
                            "userName": location.state.userData.userName
                        })
                        .catch(()=>{
                            storage.ref("profile_images/" + profileImageName).delete();
                            notyf.error("Desculpe, ocorreu um erro ao atualizar sua imagem");
                            setRedirect(
                                <Redirect to={{ 
                                    pathname: ("/profile/" + location.state.userData.id), 
                                    state: {
                                        firstLogin: false, 
                                        profilePhoto: location.state.profilePhoto,
                                        coverPhoto: location.state.coverPhoto, 
                                        userData: location.state.userData,
                                        origin: "edit-images-screen-error"
                                    }}}
                                />
                            )
                        }) 
                        .finally(()=>{
                            setRedirect(
                                <Redirect to={{ 
                                    pathname: ("/profile/" + location.state.userData.id), 
                                    state: {
                                        firstLogin: false, 
                                        profilePhoto: profileImageName,
                                        coverPhoto: location.state.coverPhoto, 
                                        userData: location.state.userData,
                                        origin: "edit-profile-image-save"
                                    }}}
                                />
                            )
                        })
                    })
                    .catch((error) => {
                        console.log("Erro ao carregar profilePhoto - ");
                        console.log(error);
                        notyf.error("Desculpe, ocorreu um erro ao atualizar sua imagem");
                        setRedirect(
                            <Redirect to={{ 
                                pathname: ("/profile/" + location.state.userData.id), 
                                state: {
                                    firstLogin: false, 
                                    profilePhoto: location.state.profilePhoto,
                                    coverPhoto: location.state.coverPhoto, 
                                    userData: location.state.userData,
                                    origin: "edit-images-screen-error"
                                }}}
                            />
                        )
                    })

            })
            .catch(function (error) {
                console.log(">>>Erro ao deletar profilePhoto");
                console.log(error);
                notyf.error("Desculpe, ocorreu um erro ao atualizar sua imagem");
                setRedirect(
                    <Redirect to={{ 
                        pathname: ("/profile/" + location.state.userData.id), 
                        state: {
                            firstLogin: false, 
                            profilePhoto: location.state.profilePhoto,
                            coverPhoto: location.state.coverPhoto, 
                            userData: location.state.userData,
                            origin: "edit-images-screen-error"
                        }}}
                    />
                )
            })
        }
    }

    //--------------------------------------change cover photo---------------------
    function handleCoverPhotoChange(){      
        
        // perfil sem coverPhoto
        if (isEmpty(location.state.coverPhoto)){

            coverImageName = (emailUser + "_cover." + newCoverImage.name.split(".").pop());
            
            storage.ref("profile_images/" + coverImageName).put(newCoverImage)
                .then(()=>{
                    api.put('/profile/update', {
                        "id": location.state.userData.id,
                        "city": location.state.userData.city,
                        "details": location.state.userData.details,
                        "coverPhoto": coverImageName,
                        "profileInformation": location.state.userData.profileInformation,
                        "profilePhoto": location.state.profilePhoto,
                        "emailUser": emailUser,
                        "region": location.state.userData.region,
                        "userName": location.state.userData.userName
                    })
                    .catch(()=>{
                        storage.ref("profile_images/" + coverImageName).delete();
                        notyf.error("Desculpe, ocorreu um erro ao atualizar a imagem");
                        setRedirect(
                            <Redirect to={{ 
                                pathname: ("/profile/" + location.state.userData.id), 
                                state: {
                                    firstLogin: false, 
                                    profilePhoto: location.state.profilePhoto,
                                    coverPhoto: location.state.coverPhoto, 
                                    userData: location.state.userData,
                                    origin: "edit-images-screen-error"
                                }}}
                            />
                        )
                    })
                    .finally(()=>{
                        setRedirect(
                            <Redirect to={{ 
                                pathname: ("/profile/" + location.state.userData.id), 
                                state: {
                                    firstLogin: false, 
                                    profilePhoto: location.state.profilePhoto,
                                    coverPhoto: coverImageName, 
                                    userData: location.state.userData,
                                    origin: "edit-cover-image-save"
                                }}}
                            />
                        )
                    })
                })
                .catch((error) => {
                    console.log("Erro ao carregar profilePhoto - ");
                    console.log(error);
                    notyf.error("Desculpe, ocorreu um erro ao atualizar a imagem");
                    setRedirect(
                        <Redirect to={{ 
                            pathname: ("/profile/" + location.state.userData.id), 
                            state: {
                                firstLogin: false, 
                                profilePhoto: location.state.profilePhoto,
                                coverPhoto: location.state.coverPhoto, 
                                userData: location.state.userData,
                                origin: "edit-images-screen-error"
                            }}}
                        />
                    )
                })

        // perfil com coverPhoto
        } else {
            coverImageName = (emailUser + "_cover." + newCoverImage.name.split(".").pop())

            storage.refFromURL(location.state.coverPhoto).delete().then(()=>{                
                storage.ref("profile_images/" + coverImageName).put(newCoverImage)
                    .then(()=>{
                        api.put('/profile/update', {
                            "id": location.state.userData.id,
                            "city": location.state.userData.city,
                            "details": location.state.userData.details,
                            "coverPhoto": coverImageName,
                            "profileInformation": location.state.userData.profileInformation,
                            "profilePhoto": location.state.profilePhoto,
                            "emailUser": emailUser,
                            "region": location.state.userData.region,
                            "userName": location.state.userData.userName
                        })
                        .catch(()=>{
                            storage.ref("profile_images/" + coverImageName).delete();
                            notyf.error("Desculpe, ocorreu um erro ao atualizar sua foto do perfil");
                            setRedirect(
                                <Redirect to={{ 
                                    pathname: ("/profile/" + location.state.userData.id), 
                                    state: {
                                        firstLogin: false, 
                                        profilePhoto: location.state.profilePhoto,
                                        coverPhoto: location.state.coverPhoto, 
                                        userData: location.state.userData,
                                        origin: "edit-images-screen-error"
                                    }}}
                                />
                            )
                        })
                        .finally(()=>{
                            setRedirect(
                                <Redirect to={{ 
                                    pathname: ("/profile/" + location.state.userData.id), 
                                    state: {
                                        firstLogin: false, 
                                        profilePhoto: location.state.profilePhoto,
                                        coverPhoto: coverImageName, 
                                        userData: location.state.userData,
                                        origin: "edit-cover-image-save"
                                    }}}
                                />
                            )
                        })
                        
                    })
                    .catch((error) => {
                        console.log("Erro ao carregar profilePhoto - ");
                        console.log(error);
                        notyf.error("Desculpe, ocorreu um erro ao atualizar sua foto do perfil");
                        setRedirect(
                            <Redirect to={{ 
                                pathname: ("/profile/" + location.state.userData.id), 
                                state: {
                                    firstLogin: false, 
                                    profilePhoto: location.state.profilePhoto,
                                    coverPhoto: location.state.coverPhoto, 
                                    userData: location.state.userData,
                                    origin: "edit-images-screen-error"
                                }}}
                            />
                        )
                    })

            })
            .catch(function (error) {
                console.log(">>>Erro ao deletar profilePhoto");
                console.log(error);
                notyf.error("Desculpe, ocorreu um erro ao atualizar sua foto do perfil");
                setRedirect(
                    <Redirect to={{ 
                        pathname: ("/profile/" + location.state.userData.id), 
                        state: {
                            firstLogin: false, 
                            profilePhoto: location.state.profilePhoto,
                            coverPhoto: location.state.coverPhoto, 
                            userData: location.state.userData,
                            origin: "edit-images-screen-error"
                        }}}
                    />
                )
            })
        }
    }

}


