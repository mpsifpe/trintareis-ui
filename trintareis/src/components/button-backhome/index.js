import { Link } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import './button.css'

export default function () {
    return (
        <Link to='home' style={{ textDecoration: 'none' }}>
            <button className="btn_icon">
                <AiOutlineClose />
            </button>
        </Link>
    )
}