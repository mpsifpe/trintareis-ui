import './friend-card.css';
import { Link } from "react-router-dom";

export default function () {
    return(
        <div className="friend-card">
            <div className="friend-content">
                <img className="friend-img" src="/static/media/minios.8f62a453.jpg" />
                <h4 className="friend-name">Roberto Carlos</h4>
                <p className="friend-usertype">Aluno </p>
                <p className="friend-course"><b>Tecnico de Edificação</b> </p>
                
            </div>
            <div className="button-disconnect">
                <Link> <span>Desconectar</span> </Link>
            </div>
            
        </div>
    )
}