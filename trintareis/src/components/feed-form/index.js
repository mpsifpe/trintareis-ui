import { AiFillVideoCamera, AiFillPicture } from "react-icons/ai";
import { BsCalendarDate } from "react-icons/bs";
import { Link } from "react-router-dom";
import minios_bg from '../../resources/minios.jpg';

export default function () {
    return (
        <div className="feed">
            <div className="feedForm">
                <img src={minios_bg} />
                <input type="text" placeholder="Começar Publicar" />
                <div className="feedIcons">
                    <div className="iconSingle img">
                        <button>
                            <AiFillPicture />
                            <span className="">
                                Foto
                            </span>
                        </button>
                    </div>
                    <div className="iconSingle">
                        <button className="">
                            <AiFillVideoCamera />
                            <span className="">
                                Vídeo
                            </span>
                        </button>
                    </div>
                    <div className="iconSingle evn">
                        <Link to='event'>
                            <button type="submit" className="">
                                <BsCalendarDate />
                                <span class="artdeco-button__text">
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