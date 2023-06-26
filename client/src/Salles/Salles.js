import './Salles.css'
import {useNavigate} from "react-router-dom";

/**
 * Crée des boutons qui vont vers les salles à partir d'une liste de nom de salles informatiques
 * @returns {JSX.Element}
 * @constructor
 */
function Salles() {
    const nomDesSalles = [
        "E01","E02", "E06/E07", "E08", "E09", "E17", "E18", "E19",
        "ES1", "ES2", "ES4", "ES7", "ES8", "ES9"]
    const navigate = useNavigate()

    return (
        <div className="salle-container">
            {nomDesSalles.map((salle, index) => (
                //classe css "salle-button" pour le style des boutons de salles
                <button className="salle-button"
                    key={index}
                    onClick={() => navigate(`/salle/${encodeURIComponent(nomDesSalles[index])}`)}
                >
                    { salle === "E06/E07" ? "E07" : salle }
                </button>
            ))}
        </div>
    )
}

export default Salles;