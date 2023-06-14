import {useNavigate, useParams} from "react-router-dom"
import {useEffect, useMemo, useState} from "react"
import moment from 'moment';
import 'moment/locale/fr';


/**
 * Affiche l'image de l'emploi du temps par jour grace à l'id de la salle passé en param (props)
 * @param props idsalle
 * @returns {JSX.Element}
 * @constructor
 */
function ImageEmploiDuTempsJour(props) {
    const { nomSalle } = useParams()
    const idSalle = props.idSalle
    const identifier = sessionStorage.getItem('identifier')
    const projectId = sessionStorage.getItem('projectId')
    const week = sessionStorage.getItem('week')
    const nbweeks = sessionStorage.getItem('nbweeks')

    //si l'ecran est de taille tel ou tablette
    const telOuTab = window.matchMedia("(max-width: 768px)").matches
    //on def la taille de la largeur en fonction de telOuTab
    const width = telOuTab ? Math.floor(window.innerWidth * 0.8) : Math.floor(window.innerWidth * 0.4)

    const height= Math.floor(window.innerHeight * 0.75)
    const navigate = useNavigate()
    const [salleCouranteIndex, setSalleCourante] = useState(0)
    const [semaineCourante, setSemaineCourante] = useState(parseInt(week))
    const nomDesSalles = useMemo(() => [
        "E01", "E02", "E06/E07", "E08", "E09", "E17", "E18", "E19",
        "ES1", "ES2", "ES4", "ES7", "ES8", "ES9"
    ], [])
    const jours = [
        {jour: "dimanche", idPianoDay: "0"}, //pck JourActuel renvoe 0 pour diamanche
        {jour: "lundi", idPianoDay: "0"},
        {jour: "mardi", idPianoDay: "%2C1"},
        {jour: "mercredi", idPianoDay: "%2C2"},
        {jour: "jeudi", idPianoDay: "%2C3"},
        {jour: "vendredi", idPianoDay: "%2C4"},
        {jour: "samedi", idPianoDay: "%2C5"},
    ]
    const [jourCourant, setJourCourant] = useState(moment().startOf('day'))
    const [jourEnChiffre, setJourEnChiffre] = useState(new Date().getDay()) //renvoie un nombre compris entre 0 (dimanche) et 6 (samedi)
    const [idPianoDay, setIdPianoDay] = useState(jours[jourEnChiffre].idPianoDay)


    /**
     * On initialise l'index de la salle pour passer au salles suivantes et precedentes dans l'ordre
     */
    useEffect(() => {
        const indexSalle = nomDesSalles.findIndex((nom) => nom === nomSalle)
        if (indexSalle !== -1) {
            setSalleCourante(indexSalle)
        }
    }, [nomDesSalles])

    /**
     * Reinitialise la semaine courante et le jour courant
     */
    const resetSemaineCouranteEtJourCourant = () => {
        setSemaineCourante(parseInt(sessionStorage.getItem('week')))
        setJourCourant(moment().startOf('day'))
    }

    /**
     * Navigue à la salle precedente grace à l'index
     * et reinitialise le jour et la semaine courante au cas ou on a regardé l'emploie du temmps
     * d'une semaine ou un jour different
     */
    const goToSallePrecedente = () => {
        const newIndex = salleCouranteIndex === 0 ? nomDesSalles.length - 1 : salleCouranteIndex - 1
        setSalleCourante(newIndex)
        navigate(`/salle/${encodeURIComponent(nomDesSalles[newIndex])}`)
        resetSemaineCouranteEtJourCourant()
    }

    /**
     * Navigue à la salle suivante grace à l'index
     * et reinitialise le jour et la semaine courante au cas ou on a regardé l'emploie du temmps
     * d'une semaine ou un jour different
     */
    const goToSalleSuivante = () => {
        const newIndex = salleCouranteIndex === nomDesSalles.length - 1 ? 0 : salleCouranteIndex + 1
        setSalleCourante(newIndex)
        navigate(`/salle/${encodeURIComponent(nomDesSalles[newIndex])}`)
        resetSemaineCouranteEtJourCourant()
    }

    /**
     * Calcule le idpiano du jour suivant et la semaine si necessaire
     */
    const goToJourSuivant = () => {
        if (semaineCourante < nbweeks) {
            if (jourEnChiffre === 6) { // si samedi on va à lundi
                setSemaineCourante(semaineCourante + 1)
                setIdPianoDay(jours[1].idPianoDay)
                setJourEnChiffre(1)
                setJourCourant(jourCourant.clone().add(2,'days'))
            }
            else {
                setJourEnChiffre(jourEnChiffre + 1)
                setIdPianoDay(jours[jourEnChiffre + 1].idPianoDay)
                setJourCourant(jourCourant.clone().add(1,'days'))
            }
        }
    }

    /**
     * Calcule le idpiano du jour precedente et la semaine si necessaire
     */
    const goToJourPrecedent = () => {
        if (semaineCourante > 0) {
            if (jourEnChiffre === 1) { // si lundi on va à samedi
                setSemaineCourante(semaineCourante - 1)
                setIdPianoDay(jours[6].idPianoDay)
                setJourEnChiffre(6)
                setJourCourant(jourCourant.clone().subtract(2,'days'))
            }
            else {
                setJourEnChiffre(jourEnChiffre - 1)
                setIdPianoDay(jours[jourEnChiffre - 1].idPianoDay)
                setJourCourant(jourCourant.clone().subtract(1,'days'))
            }
        }
    }


    const imgUrl = `https://aderead.univ-orleans.fr/jsp/imageEt?identifier=${identifier}&projectId=${projectId}&idPianoWeek=${semaineCourante}&idPianoDay=${idPianoDay}&idTree=${idSalle}&width=${width}&height=${height}&lunchName=REPAS&displayMode=1057855&showLoad=false&ttl=1662920359936&displayConfId=169`

    return (
        <div>
            <div className="date">
                <button className="boutonPrecSuiv" onClick={goToJourPrecedent}>Prec</button>
                <span>{jourCourant.format('dddd D MMM').replace(/^\w/, c => c.toUpperCase())}</span>
                <button className="boutonPrecSuiv" onClick={goToJourSuivant}>Suiv</button>
            </div>
            <div className="emploi-du-temps-container">
                <button className="emploi-du-temps-button-gauche" onClick={goToSallePrecedente}>&lt;</button>
                <img src={imgUrl} alt="Probleme lors du chargement de l'emploi du temps" />
                <button className="emploi-du-temps-button-droit" onClick={goToSalleSuivante}>&gt;</button>
            </div>
        </div>
    );
}

export default ImageEmploiDuTempsJour;