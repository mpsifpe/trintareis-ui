import { AiFillVideoCamera, AiFillPicture } from "react-icons/ai";
import { BsCalendarDate } from "react-icons/bs";
import minios_bg from '../../resources/minios.jpg';

export default function () {
    return (
        <div className="feed">
            <div className="feedForm">
                <img src={minios_bg} />
                <input type="text" placeholder="Começar Publicar" />

                <div className="feedIcons">
                    <div className="iconSingle img">
                        <AiFillPicture />
                        <span>Foto</span>
                    </div>
                    <div className="iconSingle">
                        <AiFillVideoCamera />
                        <span>Vídeo</span>
                    </div>
                    <div className="iconSingle evn">
                        <BsCalendarDate />
                        <span>Evento</span>
                    </div>
                </div>
            </div>
        </div>
    )
}