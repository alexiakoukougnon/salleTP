import './Navbar.css'
import {NavLink} from "react-router-dom"

function Navbar() {
    return (
        <nav>
            <NavLink to="/">Accueil</NavLink>
            <NavLink to="/lesSalles">Toutes les salles</NavLink>
        </nav>
    );
}

export default Navbar;