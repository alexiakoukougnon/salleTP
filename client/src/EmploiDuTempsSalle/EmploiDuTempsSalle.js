import './EmploiDuTempsSalle.css'
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import ImageEmploiDuTemps from "../ImageEmploiDuTemps/ImageEmploiDuTemps";
import ImageEmploiDuTempsJour from "../ImageEmploiDuTempsJour/ImageEmploiDuTempsJour";


/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
function EmploiDuTempsSalle() {
    const { nomSalle } = useParams()
    const [idSalle, setIdSalle] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [typeEDT, setTypeEDT] = useState("semaine")// par défaut, on affiche l'emploi du temps de la semaine

    /**
     * Prend le nom de la salle en parametre et va recuperer l'id de la salle
     * soit l'id est deja enregistré en session soit on va le chercher dans l'api intermediaire
     */
    useEffect(() => {
        setIsLoading(true)// on indique que l'image est en train de charger
        const storedIdSalle = sessionStorage.getItem(nomSalle); //on recupere l'id de la salle dans sessionStorage
        if (storedIdSalle) {
            setIdSalle(storedIdSalle) //si l'id est deja en session on l'utilise
            setIsLoading(false)
        }
        else {
            window.fetch(`/occupation-salles-tp/api/salle/${encodeURIComponent(nomSalle)}`)
                .then((res) => res.json())
                .then((json) => {
                    sessionStorage.setItem(nomSalle, json.id) //on stocke l'id en session
                    setIdSalle(json.id)
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally(() => {
                    setIsLoading(false)// une fois que la requête est terminée, on indique que l'image a fini de charger
                })
        }
    }, [nomSalle])

    /**
     * Nous permet d'alterner entre une vue de l'emploie du temps par semaine et par jour
     */
    const handleSwitchTypeEDT = () => {
        setTypeEDT((typePrecedent) => (typePrecedent === "jour" ? "semaine" : "jour"));
    }

    return (
        <div className="EmploiDuTempsSalle">
            <h3>
                Salle {nomSalle}
                <button onClick={handleSwitchTypeEDT} className="semaineOuJour">
                    {typeEDT === "semaine" ? "Jour" : "Semaine"}
                </button>
            </h3>

            {isLoading ? (
                <p>Chargement de l'emploi du temps en cours...</p>
            ) : typeEDT === "jour" ? (
                <ImageEmploiDuTempsJour idSalle={idSalle} />
            ) : (
                <ImageEmploiDuTemps idSalle={idSalle} />
            )}
        </div>
    );
}

export default EmploiDuTempsSalle;
