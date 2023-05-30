import '../EmploiDuTempsSalle/EmploiDuTempsSalle.css'
import {useNavigate} from "react-router-dom"
import {useEffect, useState} from "react"
import moment from 'moment';

/**
 * Affiche l'image de l'emploi du temps par semaine grace à l'id de la salle passé en param (props)
 * @param props idsalle
 * @returns {JSX.Element}
 * @constructor
 */
function ImageEmploiDuTemps(props) {
    const idSalle = props.idSalle
    const identifier = sessionStorage.getItem('identifier')
    const projectId = sessionStorage.getItem('projectId')
    const week = sessionStorage.getItem('week')
    const nbweeks = sessionStorage.getItem('nbweeks')
    const width = Math.floor(window.innerWidth * 0.8)
    const height= Math.floor(window.innerHeight * 0.75)
    const navigate = useNavigate()
    const [salleCouranteIndex, setSalleCourante] = useState(0)
    const [semaineCourante, setSemaineCourante] = useState(parseInt(week))
    const [lundiCourant, setLundiCourant] = useState(moment().startOf('isoWeek'))
    const nomDesSalles = [
        "E01", "E02", "E06/E07", "E08", "E09", "E17", "E18", "E19",
        "ES1", "ES2", "ES4", "ES7", "ES8", "ES9"
    ]

    /**
     * On initialise l'index de la salle pour passer au salles suivantes et precedentes dans l'ordre
     */
    useEffect(() => {
        const nomSalle = decodeURIComponent(window.location.pathname.replace('/salle/', ''))
        const indexSalle = nomDesSalles.findIndex((nom) => nom === nomSalle)
        if (indexSalle !== -1) {
            setSalleCourante(indexSalle)
        }
    }, [nomDesSalles])

    /**
     * Reinitialise la semaine courante et le Lundi courant
     */
    const resetSemaineCouranteEtLundiCourant = () => {
        setSemaineCourante(parseInt(sessionStorage.getItem('week')))
        setLundiCourant(moment().startOf('isoWeek'))
    }

    /**
     * Navigue à la salle precedente grace à l'index
     * et reinitialise le lundi et la semaine courante au cas ou on a regardé l'emploie du temmps
     * d'une semaine ou un jour different
     */
    const goToSallePrecedente = () => {
        const newIndex = salleCouranteIndex === 0 ? nomDesSalles.length - 1 : salleCouranteIndex - 1
        setSalleCourante(newIndex)
        navigate(`/salle/${encodeURIComponent(nomDesSalles[newIndex])}`)
        resetSemaineCouranteEtLundiCourant()
    }

    /**
     * Navigue à la salle suivante grace à l'index
     * et reinitialise le lundi et la semaine courante au cas ou on a regardé l'emploie du temmps
     * d'une semaine ou un jour different
     */
    const goToSalleSuivante = () => {
        const newIndex = salleCouranteIndex === nomDesSalles.length - 1 ? 0 : salleCouranteIndex + 1
        setSalleCourante(newIndex)
        navigate(`/salle/${encodeURIComponent(nomDesSalles[newIndex])}`)
        resetSemaineCouranteEtLundiCourant()
    }

    /**
     * Ajoute 1 à la semaine courante s'arrête à la limite
     */
    const goToSemaineSuivante = () => {
        if (semaineCourante < nbweeks) {
            setSemaineCourante(semaineCourante + 1)
            const newLundi = lundiCourant.clone().add(7, 'days')
            setLundiCourant(newLundi)
        }
    }

    /**
     * Soustrait 1 à la semaine courante s'arrête à la 0
     */
    const goToSemainePrecedente = () => {
        if (semaineCourante > 0) {
            setSemaineCourante(semaineCourante - 1);
            const newLundi = lundiCourant.clone().subtract(7, 'days');
            setLundiCourant(newLundi);
        }
    }



    const imgUrl = `https://aderead.univ-orleans.fr/jsp/imageEt?identifier=${identifier}&projectId=${projectId}&idPianoWeek=${semaineCourante}&idPianoDay=0%2C1%2C2%2C3%2C4%2C5&idTree=${idSalle}&width=${width}&height=${height}&lunchName=REPAS&displayMode=1057855&showLoad=false&ttl=1662920359936&displayConfId=169`

    return (
        <div>
            <div className="date">
                <button className="boutonPrecSuiv" onClick={goToSemainePrecedente}>Prec</button>
                <span>{lundiCourant.format('DD/MM/YYYY')}</span>
                <button className="boutonPrecSuiv" onClick={goToSemaineSuivante}>Suiv</button>
            </div>
            <div className="emploi-du-temps-container">
                <button className="emploi-du-temps-button-gauche" onClick={goToSallePrecedente}>&lt;</button>
                <img src={imgUrl} alt="Probleme lors du chargement de l'emploi du temps" />
                <button className="emploi-du-temps-button-droit" onClick={goToSalleSuivante}>&gt;</button>
            </div>
        </div>
    );

}

export default ImageEmploiDuTemps;