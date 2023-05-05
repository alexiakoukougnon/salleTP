import './EmploiDuTempsSalle.css'
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

function EmploiDuTempsSalle() {
    const { nomSalle } = useParams()
    const [idSalle, setIdSalle] = useState("")
    const [identifier, setIdentifier] = useState("")
    const [projectId, setProjectId] = useState("")
    const [week, setWeek] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const width = Math.floor(window.innerWidth * 0.8);
    const height = Math.floor(window.innerHeight * 0.7);


    useEffect(() => {
        setIsLoading(true); // on indique que l'image est en train de charger
        axios.get(`http://localhost:4000/salle/${encodeURIComponent(nomSalle)}`)
            .then(res => {
                setIdSalle(res.data.id)
                setIdentifier(res.data.ident)
                setProjectId(res.data.projectId)
                setWeek(res.data.semaine)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)// une fois que la requête est terminée, on indique que l'image a fini de charger
            })
    }, [nomSalle])

    const imgUrl = `https://aderead.univ-orleans.fr/jsp/imageEt?identifier=${identifier}&projectId=${projectId}&idPianoWeek=${week}&idPianoDay=0%2C1%2C2%2C3%2C4%2C5&idTree=${idSalle}&width=${width}&height=${height}&lunchName=REPAS&displayMode=1057855&showLoad=false&ttl=1662920359936&displayConfId=169`

    return (
        <div className="EmploiDuTempsSalle">
            <h1>Emploi Du Temps de la Salle {nomSalle} </h1>
            {isLoading ? (
                <p>Chargement de l'emploi du temps en cours...</p>
            ) : (
                <img src={imgUrl} alt="Probleme lors du chargement de l'emploi du temps" />
            )}
        </div>
    );
}

export default EmploiDuTempsSalle;