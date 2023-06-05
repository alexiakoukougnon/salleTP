import './Navbar.css'
import {NavLink} from "react-router-dom"

/**
 * Deux liens l'un qui ramene vers l'accueil avec les salles informatiques
 * et l'autres va vers l'emploie du temps de toutes les salles infomatiques
 * @returns {JSX.Element}
 * @constructor
 */
function Navbar() {
    return (
        <nav>
            <NavLink to="/">Choix des salles</NavLink>
            <NavLink to="/sallesTP">Toutes les salles</NavLink>
        </nav>
    );
}

export default Navbar;