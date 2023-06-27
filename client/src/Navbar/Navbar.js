import './Navbar.css'
import '../EmploiDuTempsSalle/EmploiDuTempsSalle.css'
import {NavLink, useNavigate} from "react-router-dom"
import {useState} from "react";

/**
 * Deux liens l'un qui ramene vers l'accueil avec les salles informatiques
 * et l'autres va vers l'emploie du temps de toutes les salles infomatiques
 * @returns {JSX.Element}
 * @constructor
 */
function Navbar() {
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchTerm.trim() === '') {
            //si le champ de recherche est vide -> rien faire
            return
        }
        navigate(`/salle/${encodeURIComponent(searchTerm)}`)
        setSearchTerm('')
    }
    return (
        <nav>
            <NavLink to="/">Choix des salles</NavLink>
            <NavLink to="/sallesTP">Toutes les salles</NavLink>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Rechercher une salle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="boutonPrecSuiv" type="submit">Rechercher</button>
            </form>
        </nav>
    )
}

export default Navbar;