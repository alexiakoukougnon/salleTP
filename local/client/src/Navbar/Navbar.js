import './Navbar.css'
import '../EmploiDuTempsSalle/EmploiDuTempsSalle.css'
import {NavLink, useNavigate} from "react-router-dom"
import {useState} from "react";
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';

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
            <NavLink to="/"><HomeIcon/></NavLink>
            <NavLink to="/sallesTP"><CalendarMonthIcon/></NavLink>

            <div>
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Rechercher une salle..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit"><SearchIcon/></button>
                </form>
            </div>

        </nav>
    )
}

export default Navbar;