import Dropdown from 'react-bootstrap/Dropdown';
import { BiEdit } from "react-icons/bi";

// Cores para o botão
// https://react-bootstrap.github.io/components/dropdowns/
// ['primary', 'secondary', 'success', 'info', 'warning', 'danger']

function DropdownProfile() {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
        <BiEdit/>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Perfil</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Foto Perfil</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Foto de Capa</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownProfile;