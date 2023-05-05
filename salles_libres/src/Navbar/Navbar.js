import './Navbar.css'
import {NavLink, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

function Navbar() {
    const nomDesSalles = [
        "E01", "E02", "E06/E07", "E08", "E09", "E17", "E18", "E19",
        "ES1", "ES2", "ES4", "ES7", "ES8", "ES9"
    ]
    const navigate = useNavigate()
    const [salleCouranteIndex, setSalleCourante] = useState(0)

    useEffect(() => {
        const nomSalle = decodeURIComponent(window.location.pathname.replace('/salle/', ''));
        const indexSalle = nomDesSalles.findIndex((nom) => nom === nomSalle);
        if (indexSalle !== -1) {
            setSalleCourante(indexSalle);
        }
    }, [nomDesSalles]);


    const goToSallePrecedente = () => {
        const newIndex = salleCouranteIndex === 0 ? nomDesSalles.length - 1 : salleCouranteIndex - 1;
        setSalleCourante(newIndex);
        navigate(`/salle/${encodeURIComponent(nomDesSalles[newIndex])}`);
    }

    const goToSalleSuivante = () => {
        const newIndex = salleCouranteIndex === nomDesSalles.length - 1 ? 0 : salleCouranteIndex + 1;
        setSalleCourante(newIndex);
        navigate(`/salle/${encodeURIComponent(nomDesSalles[newIndex])}`);
    }


    return (
        <nav>
            <NavLink to="/">Accueil</NavLink>
            <button onClick={goToSallePrecedente}>&lt;</button>
            <button onClick={goToSalleSuivante}>&gt;</button>
        </nav>
    );
}

export default Navbar;