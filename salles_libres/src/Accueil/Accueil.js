import './Accueil.css'
import Salles from "../Salles/Salles";

function Accueil() {
    return (
        <div className="Accueil">
            <h1>Accueil</h1>
            <Salles/>
        </div>
    );
}

export default Accueil;