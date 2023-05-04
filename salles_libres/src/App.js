import './App.css';
import {Routes, Route, NavLink, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

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

function PageInconnue() {
    return (
        <div>
            <h1>404 Not Found</h1>
            <p>Désolé, la page que vous cherchez n'existe pas.</p>
        </div>
    );
}

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

function Footer() {
    return (
        <footer className="footer">
            <p>Projet Informatique.</p>
        </footer>
    );
}


function Accueil() {
    return (
        <div className="App">
            <h1>Accueil</h1>
            <Salles/>
        </div>
    );
}


/**
 * Boucle sur le tableau "nomDesSalles" pour créer un bouton pour chaque salle
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
                onClick={ () => {navigate(`/salle/${encodeURIComponent(salle)}`)} }
                >
                    { salle === "E06/E07" ? "E07" : salle }
                </button>
            ))}
        </div>
    );
}


function EmploiDuTempsSalle() {
    const { nomSalle } = useParams();
    const [idSalle, setIdSalle] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const week = 34;
    const width = Math.floor(window.innerWidth * 0.8);
    const height = Math.floor(window.innerHeight * 0.7);


    useEffect(() => {
        setIsLoading(true); // on indique que l'image est en train de charger
        axios.get(`http://localhost:4000/salle/${encodeURIComponent(nomSalle)}`)
            .then(res => {
                setIdSalle(res.data.id);
                setIdentifier(res.data.ident);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false); // une fois que la requête est terminée, on indique que l'image a fini de charger
            });
    }, [nomSalle]);

    const imgUrl = `https://aderead.univ-orleans.fr/jsp/imageEt?identifier=${identifier}&projectId=0&idPianoWeek=${week}&idPianoDay=0%2C1%2C2%2C3%2C4%2C5&idTree=${idSalle}&width=${width}&height=${height}&lunchName=REPAS&displayMode=1057855&showLoad=false&ttl=1662920359936&displayConfId=169`;

    return (
        <div className="App">
            <h1>Emploi Du Temps de la Salle {nomSalle} </h1>
            {isLoading ? (
                <p>Chargement de l'emploi du temps en cours...</p>
            ) : (
                <img src={imgUrl} alt="Probleme lors du chargement de l'emploi du temps" />
            )}
        </div>
    );
}




export default App;
