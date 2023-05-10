import './App.css';
import {Routes, Route, useNavigate} from "react-router-dom";
import Navbar from '../Navbar/Navbar'
import Accueil from "../Accueil/Accueil";
import PageInconnue from "../PageInconnue/PageInconnue";
import EmploiDuTempsSalle from "../EmploiDuTempsSalle/EmploiDuTempsSalle";
import Footer from "../Footer/Footer";
import {useEffect} from "react";
import axios from "axios";
import ToutesLesSalles from "../ToutesLesSalles/ToutesLesSalles";


function App() {

    useEffect(() => {
        axios.get(`http://localhost:5000/accueil`)
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
                <Route path="/accueil" element={<Accueil/>} />
                <Route path="/salle/:nomSalle" element={<EmploiDuTempsSalle/>} />
                <Route path="/lesSalles" element={<ToutesLesSalles/>} />
            </Routes>
            <Footer/>
        </>
    );
}



export default App;
