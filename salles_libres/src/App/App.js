import './App.css';
import {Routes, Route} from "react-router-dom";
import Navbar from '../Navbar/Navbar'
import Accueil from "../Accueil/Accueil";
import PageInconnue from "../PageInconnue/PageInconnue";
import EmploiDuTempsSalle from "../EmploiDuTempsSalle/EmploiDuTempsSalle";
import Footer from "../Footer/Footer";


function App() {
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="*" element={<PageInconnue/>} />
                <Route path="/" element={<Accueil/>} />
                <Route path="/accueil" element={<Accueil/>} />
                <Route path="/salle/:nomSalle" element={<EmploiDuTempsSalle/>} />
            </Routes>
            <Footer/>
        </>
    );
}

export default App;
