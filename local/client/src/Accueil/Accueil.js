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
            <br/>
            <h2>EDT : Occupation des Salles de TP</h2>
            <br/>
            <Salles/>

            <p className="message">
                Consultez les emplois du temps des salles de TP du bâtiment informatique.
            </p>

        </div>
    );
}

export default Accueil;