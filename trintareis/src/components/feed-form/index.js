import { AiFillVideoCamera, AiFillPicture } from "react-icons/ai";
import { BsCalendarDate } from "react-icons/bs";
import { Link } from "react-router-dom";
import minios_bg from '../../resources/minios.jpg';
import './feedForm.css'

export default function () {
    return (
        <div className="feed">
            <div className="feedForm">
                <div className="div__header">
                    <div className="div__foto">
                        <div>
                            <img src={minios_bg} />
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
                        <Link to='postPhoto' style={{ textDecoration: 'none' }}>
                            <button type="submit">
                                <AiFillPicture />
                                <span>
                                    Foto
                                </span>
                            </button>
                        </Link>
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
        </div>
    )
}