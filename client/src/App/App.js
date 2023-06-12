import './App.css';
import {Routes, Route} from "react-router-dom";
import Navbar from '../Navbar/Navbar'
import Accueil from "../Accueil/Accueil";
import PageInconnue from "../PageInconnue/PageInconnue";
import EmploiDuTempsSalle from "../EmploiDuTempsSalle/EmploiDuTempsSalle";
import {useEffect} from "react";
import ToutesLesSalles from "../ToutesLesSalles/ToutesLesSalles";


/**
 * Composant principal de l'application.
 * Gère la navigation et effectue une requête HTTP GET lors du montage initial du composant
 * pour récupérer des données à stocker en session.
 * @returns {JSX.Element}
 * @constructor
 */
function App() {

    useEffect( () => {
        window.fetch("/occupation-salles-tp/api/accueil")
            .then((res) => res.json())
            .then((json) => {
                sessionStorage.setItem('projectId', json.projectId)
                sessionStorage.setItem('identifier', json.identifier)
                sessionStorage.setItem('week', json.week)
                sessionStorage.setItem('nbweeks', json.nbweeks)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])


    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="*" element={<PageInconnue/>} />
                <Route path="/" element={<Accueil/>} />
                <Route path="/salle/:nomSalle" element={<EmploiDuTempsSalle/>} />
                <Route path="/sallesTP" element={<ToutesLesSalles/>} />
            </Routes>
        </>
    );
}



export default App;
