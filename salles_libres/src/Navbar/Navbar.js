import './Navbar.css'
import {NavLink} from "react-router-dom"

function Navbar() {
    return (
        <nav>
            <NavLink to="/">Accueil</NavLink>
        </nav>
    );
}

export default Navbar;