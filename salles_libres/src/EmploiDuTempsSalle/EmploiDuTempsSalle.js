import './EmploiDuTempsSalle.css'
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import ImageEmploiDuTemps from "../ImageEmploiDuTemps/ImageEmploiDuTemps";

function EmploiDuTempsSalle() {
    const { nomSalle } = useParams()
    const [idSalle, setIdSalle] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)// on indique que l'image est en train de charger
        const storedIdSalle = sessionStorage.getItem(nomSalle); //on recupere l'id de la salle dans sessionStorage
        if (storedIdSalle) {
            setIdSalle(storedIdSalle) //si l'id est deja en session on l'utilise
            setIsLoading(false)
        }
        else {
            axios.get(`http://localhost:5000/salle/${encodeURIComponent(nomSalle)}`)
                .then(res => {
                    sessionStorage.setItem(nomSalle, res.data.id); //on stocke l'id en session
                    setIdSalle(res.data.id);
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {
                    setIsLoading(false)// une fois que la requête est terminée, on indique que l'image a fini de charger
                })
        }
    }, [nomSalle])

    return (
        <div className="EmploiDuTempsSalle">
            <h3>Emploi Du Temps de la Salle {nomSalle} </h3>
            {isLoading ? (
                <p>Chargement de l'emploi du temps en cours...</p>
            ) : (
                < ImageEmploiDuTemps
                    idSalle={idSalle}
                />
            )}
        </div>
    );
}

export default EmploiDuTempsSalle;