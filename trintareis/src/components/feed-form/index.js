import { AiFillVideoCamera, AiFillPicture } from "react-icons/ai";
import { BsCalendarDate } from "react-icons/bs";
import { Link } from "react-router-dom";
import minios_bg from '../../resources/minios.jpg';
import './feedForm.css'

export default function () {
    return (
        <div className="feed">
            <div className="feedForm">
                <img src={minios_bg} />
                <input type="text" placeholder="Começar Publicar" />
                <div className="feedForm__icons">
                    <div className="iconSingle img feedForm__reaction">
                        <button>
                            <AiFillPicture />
                            <span>
                                Foto
                            </span>
                        </button>
                    </div>
                    <div className="iconSingle feedForm__reaction">
                        <button>
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