import minios_bg from '../../resources/minios.jpg';

export default function (props) {
    return (
        <div className="feedPost">
            <div className="feedPostSingle">
                <div className="feedPost__profile">
                    <img src={minios_bg} />
                    <h3>{props.nome}<br /><span>{props.horario}</span></h3>
                </div>
                <div className="feedPost__content">
                    <p>{props.conteudo}</p>
                    <img src="https://pbs.twimg.com/media/EKkDakiXsAECxgW.jpg" />
                </div>
            </div>
        </div>
    )
}