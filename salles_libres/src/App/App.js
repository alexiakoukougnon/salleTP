import './App.css';
import {Routes, Route, useNavigate} from "react-router-dom";
import Navbar from '../Navbar/Navbar'
import Accueil from "../Accueil/Accueil";
import PageInconnue from "../PageInconnue/PageInconnue";
import EmploiDuTempsSalle from "../EmploiDuTempsSalle/EmploiDuTempsSalle";
import {useEffect} from "react";
import axios from "axios";
import ToutesLesSalles from "../ToutesLesSalles/ToutesLesSalles";


/**
 * Composant principal de l'application.
 * Gère la navigation et effectue une requête HTTP GET lors du montage initial du composant
 * pour récupérer des données à stocker en session.
 * @returns {JSX.Element}
 * @constructor
 */
function App() {

    useEffect(() => {
        axios.get(`http://localhost:7000/api/accueil`)
            .then(res => {
                sessionStorage.setItem('projectId', res.data.projectId);
                sessionStorage.setItem('identifier', res.data.identifier);
                sessionStorage.setItem('week', res.data.week);
                sessionStorage.setItem('nbweeks', res.data.nbweeks)
            })
            .catch(err => {
                console.log(err)
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
