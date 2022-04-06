import React, { useState } from 'react';
import './profile.css';
import { Link } from "react-router-dom";
import Header from '../../components/header/index';
import { FiEdit2 } from "react-icons/fi";

import firebase from '../../config/firebase';

import { Perfil, DivMain } from './styles';

function Profile() {
    const [photo, setPhoto] = useState({ preview: "", raw: "" });

    const handleChange = e => {
        if (e.target.files.length) {
            setPhoto({
                preview: URL.createObjectURL(e.target.files[0]),
                raw: e.target.files[0]
            });
        }
    };

    return (
        <div className="App">
            <Header />
            <DivMain photo={photo.preview}>
                <div className="div__btn_edit">
                    <Perfil>
                            {photo.preview ? (
                                <h5 className="text-center">Salvar foto</h5>                                
                                // <img src={photo.preview} alt="dummy" className="img__" />
                            ) : (
                                <>
                                    <h5 className="text-center">Carregar foto da capa</h5>
                                </>
                            )}
                        <input
                            type="file"
                            id="upload-button"
                            style={{ display: "none" }}
                            onChange={handleChange}
                        />
                    </Perfil>
                    {/* <FiEdit2 />
                    </input> */}
                    {/* <button onChange={handleChange} type="file" className="btn_icon__edit">
                        {photo.preview ? (
                            <img src={photo.preview} alt="dummy" width="300" height="300" />
                        ) : (
                            <>
                                <FiEdit2 />
                            </>
                        )}
                    </button> */}
                </div>
                {/* <div className="div__content_profile">
                    <div className="div__foto">

                    </div>
                    <div className="div__title_profile">
                        <a>Seu Nome</a>
                    </div>
                </div> */}
            </DivMain>
        </div>
    )
}

export default Profile;