import React, { useState, useEffect } from 'react';
import './profile.css';
import { Link } from "react-router-dom";
import Header from '../../components/header/index';
import { FiEdit2 } from "react-icons/fi";

import firebase from '../../config/firebase';

import { Perfil, DivMain, Content } from './styles';

function Profile() {
    const [photo, setPhoto] = useState({ preview: "", raw: "" });

    // useEffect(() => {
    //     handleChange();
    //     return () => {
    //         setPhoto({ preview: "", raw: "" }); // This worked for me
    //     };
    // }, []);

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
            {/* <DivMain photo={photo.preview}> */}
                <div>
                    <Perfil photo={photo.preview}>
                        <div>
                            <label>
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
                            />
                        </div>
                    </Perfil>
                    <Content>
                        <div>
                            <form className="form">                            
                                <div className="div__main_form">
                                    <div className="div__foto">
                                        <h1>Foto</h1>
                                    </div>
                                    <div>
                                        <span>Marcos Souza</span>
                                        <label>Editar</label>
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