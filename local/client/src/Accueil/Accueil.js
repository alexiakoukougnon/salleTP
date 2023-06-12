import './Accueil.css'
import Salles from "../Salles/Salles";

/**
 * Composant qui contient le nom des salles informatiques
 * dans des boutons pour acceder a l'emploie du temps
 * @returns {JSX.Element}
 * @constructor
 */
function Accueil() {
    return (
        <div className="Accueil">
            <h2>Emploi du temps des Salles de TP</h2>
            <Salles/>
        </div>
    );
}

export default Accueil;