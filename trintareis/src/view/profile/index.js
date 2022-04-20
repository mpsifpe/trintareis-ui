import React, { useState, useEffect } from 'react';
import './profile.css';
import { Link } from "react-router-dom";
import Header from '../../components/header/index';
import { FiEdit2 } from "react-icons/fi";

import firebase from '../../config/firebase';
import { useSelector } from 'react-redux';

import { Perfil, DivMain, Content } from './styles';

function Profile() {
    const [profile, setProfile] = useState([]);
    const [photo, setPhoto] = useState([]);
    let profileInfo = [];

    const emailUser = useSelector(state => state.emailUser);

    const [urlImageProfile, seturlImageProfile] = useState();
    const [urlImageCover, seturlImageCover] = useState();


    useEffect(() => {
        firebase.firestore().collection('profiles').get().then(async (result) => {
            await result.docs.forEach(doc => {
                console.log(emailUser);
                console.log(doc.data().emailUser);
                console.log(doc.data());
                if(doc.data().emailUser === emailUser){
                    firebase.storage().ref(`profile_images/${doc.data().profilePhoto}`).getDownloadURL().then(url => urlImageProfile(url));
                    firebase.storage().ref(`profile_images/${doc.data().coverPhoto}`).getDownloadURL().then(url => seturlImageCover(url));
                    // profileInfo.push({
                    //     id: doc.id,
                    //     ...doc.data()
                    // })
                    //setPhoto(doc.data());
                }
            })
            profileInfo(profileInfo);
        })
    });

    // const handleChange = e => {
    //     if (e.target.files.length) {
    //         setPhoto({
    //             preview: URL.createObjectURL(e.target.files[0]),
    //             raw: e.target.files[0]
    //         });
    //     }
    // };

    return (
        <div className="App">
            <Header />
            {/* <DivMain photo={photo.preview}> */}
                <div>
                    <Perfil photo={urlImageCover}>
                        <div>
                            {/* <label>
                                {photo.preview ? (
                                    <h5 className="text-center">Salvar foto</h5>
                                    // <img src={photo.preview} alt="dummy" className="img__" />
                                ) : (
                                    <>
                                        <h5 className="text-center">Carregar foto da capa</h5>
                                    </>
                                )}
                            </label>
                            <input
                                type="file"
                                // id="upload-button"
                                style={{ display: "none" }}
                                onChange={handleChange}
                            /> */}
                        </div>
                    </Perfil>
                    <Content photoProfile={urlImageProfile}>
                        <div>
                            <form className="form">                            
                                <div className="div__main_form">
                                    <div className="div__foto">
                                        <h1>Foto</h1>
                                    </div>
                                    <div>
                                        <span>Marcos Souza</span>
                                        <Link to='editProfile' style={{ textDecoration: 'none' }}>
                                            <label>Editar</label>
                                        </Link>
                                    </div>
                                    <div>
                                        <p>Formado em Sistemas de Informação | Cursando Pós-graduação no IFPE-Jaboatão | Trabalho como desenvolvedor backend na South System</p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Content>
                </div>
            {/* </DivMain> */}
        </div>
    )
}

export default Profile;