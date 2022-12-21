import { AiFillVideoCamera, AiFillPicture } from "react-icons/ai";
import { BsCalendarDate } from "react-icons/bs";
import { Link } from "react-router-dom";
import './feedForm.css'

import Modal from "../modal/Modal";
import useModalState from "../../hooks/useModalState";

export default function (props) {
    const [isModalOpen, openModal, closeModal] = useModalState();

    return (
        <div className="feed">
            <div className="feedForm">
                <div className="div__header">
                    <div className="div__foto">
                        <div>
                            <Link to="profile">
                                <img src={props.profilePhoto} />
                            </Link>
                        </div>
                    </div>
                    <div className="div__button">
                        <Link to='createPublication' style={{ textDecoration: 'none' }}>
                            <div className="div__span">
                                <span>Começar publicar...</span>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="feedForm__icons">
                    <div className="iconSingle img feedForm__reaction">
                        <button onClick={openModal}>
                            <AiFillPicture />
                            <span>
                                Foto
                            </span>
                        </button>
                        {/* <Link to='postPhoto' style={{ textDecoration: 'none' }}>
                            <button type="submit">
                                <AiFillPicture />
                                <span>
                                    Foto
                                </span>
                            </button>
                        </Link> */}
                    </div>
                    <div className="iconSingle feedForm__reaction">

                        <button type="submit">
                            <AiFillVideoCamera />
                            <span>
                                Vídeo
                            </span>
                        </button>

                    </div>
                    <div className="iconSingle evn feedForm__reaction">
                        <Link to='event' style={{ textDecoration: 'none' }}>
                            <button type="submit">
                                <BsCalendarDate />
                                <span className="feedForm__link">
                                    Evento
                                </span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <Modal title='Publicar' isOpen={isModalOpen} onClose={closeModal}>
                <Modal.Content>
                    <form className="form">
                        <div className="row">
                            <div>
                                <div className="div__description">
                                    <label>Descrição</label>
                                    <textarea className="form-control" rows="30" placeholder="Ex.: tópicos, programa, etc."></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <label>Carregar imagem:</label>
                            <input type="file" className="form-control" />
                        </div>
                    </form>
                </Modal.Content>
                <Modal.Footer>
                    <div className="div__btn_post">
                        <button type="button">Postar</button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    )
}