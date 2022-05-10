import { Link } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import './buttonEditProfile.css'

export default function () {
    return (
        <Link to='/profile' style={{ textDecoration: 'none' }}>
            <button className="btn_icon">
                <AiOutlineClose />
            </button>
        </Link>
    )
}