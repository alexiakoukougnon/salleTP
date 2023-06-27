import './Navbar.css'
import '../EmploiDuTempsSalle/EmploiDuTempsSalle.css'
import {NavLink, useNavigate} from "react-router-dom"
import {useEffect, useState} from "react";
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from "@mui/icons-material/Menu";
import { Drawer, List, ListItem, ListItemText, Divider } from "@mui/material";

/**
 * Deux liens l'un qui ramene vers l'accueil avec les salles informatiques
 * et l'autres va vers l'emploie du temps de toutes les salles infomatiques
 * @returns {JSX.Element}
 * @constructor
 */
function Navbar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isResponsive, setIsResponsive] = useState(false)
    const nomDesSalles = [
        "E01", "E02", "E06/E07", "E08", "E09", "E17", "E18", "E19",
        "ES1", "ES2", "ES4", "ES7", "ES8", "ES9",
    ]
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

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleWindowResize = () => {
        setIsResponsive(window.innerWidth < 768);
    };

    // Ajoute un écouteur d'événement pour détecter les changements de taille de fenêtre
    // et mettre à jour l'état "isResponsive" en conséquence
    useEffect(() => {
        window.addEventListener("resize", handleWindowResize);
        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);

    return (
        <>
            <nav className={`navbar${isResponsive ? " responsive" : ""}`}>
                {!isResponsive && (
                    <>
                        <NavLink to="/">
                            <HomeIcon />
                        </NavLink>
                        <NavLink to="/sallesTP">
                            <CalendarMonthIcon />
                        </NavLink>
                    </>
                )}
                <div className={`search-bar${isResponsive ? " responsive" : ""}`}>
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
                <div className="menu-icon" onClick={toggleDrawer}>
                    <MenuIcon />
                </div>
            </nav>
            <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer}>
                <List sx={{ width: 150 }}>
                    <ListItem button component={NavLink} to="/">
                        <ListItemText primary="Accueil" />
                    </ListItem>
                    <Divider />
                    <ListItem button component={NavLink} to="/sallesTP">
                        <ListItemText primary="Salles TP" />
                    </ListItem>
                    <Divider />
                    <div className="drawer-title">
                        <div className="title-top-divider" />
                        <ListItem sx={{ px: 2 }}>
                            <ListItemText
                                primary="Salles"
                                sx={{ fontWeight: "bold", mt: 1 }}
                            />
                        </ListItem>
                        <div className="title-bottom-divider" />
                    </div>
                    {nomDesSalles.map((salle) => (
                        <ListItem button component={NavLink} to={`/salle/${encodeURIComponent(salle)}`}>
                            <ListItemText primary={salle} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
}

export default Navbar;