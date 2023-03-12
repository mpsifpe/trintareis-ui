import './dropdownProfile.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { BiEdit } from "react-icons/bi";
import { Link } from 'react-router-dom';

// Cores para o botão
// https://react-bootstrap.github.io/components/dropdowns/  
// ['primary', 'secondary', 'success', 'info', 'warning', 'danger']

export default function DropdownProfile(props) {

  return (
    <Dropdown as={ButtonGroup}>
        <Dropdown.Toggle split variant="success" id="dropdown-split-basic"><BiEdit/></Dropdown.Toggle>

        <Dropdown.Menu style={{width:"190px"}} align="end">
            <div>
                <Link to={{
                        pathname: "/editProfile", 
                        state: {
                            firstLogin: props.firstLogin, 
                            profilePhoto: props.profilePhoto, 
                            coverPhoto: props.coverPhoto, 
                            userData: props.userData }}} className='dropdown_option'>
                    Editar perfil
                </Link>
            </div>
            <Dropdown.Divider />
            <div>
                <Link to={{
                        pathname: "/editImages", 
                        state: {
                            firstLogin: props.firstLogin, 
                            profilePhoto: props.profilePhoto, 
                            coverPhoto: props.coverPhoto, 
                            userData: props.userData,
                            image: "profile" }}} className='dropdown_option'>
                    Editar foto do perfil
                </Link>
            </div>
            <Dropdown.Divider />
            <div>
                <Link to={{
                        pathname: "/editImages", 
                        state: {
                            firstLogin: props.firstLogin, 
                            profilePhoto: props.profilePhoto, 
                            coverPhoto: props.coverPhoto, 
                            userData: props.userData,
                            image: "cover"  }}} className='dropdown_option'>
                    Editar imagem de capa
                </Link>
            </div>
        </Dropdown.Menu>
    </Dropdown>
  );
}