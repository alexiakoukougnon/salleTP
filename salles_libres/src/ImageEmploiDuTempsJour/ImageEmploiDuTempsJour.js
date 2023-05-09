import {useNavigate} from "react-router-dom"
import {useEffect, useState} from "react"
import moment from 'moment';
import 'moment/locale/fr';


function ImageEmploiDuTempsJour(props) {
    const idSalle = props.idSalle
    const identifier = sessionStorage.getItem('identifier')
    const projectId = sessionStorage.getItem('projectId')
    const week = sessionStorage.getItem('week')
    const nbweeks = sessionStorage.getItem('nbweeks')

    //si l'ecran est de taille tel ou tablette
    const telOuTab = window.matchMedia("(max-width: 768px)").matches
    //on def la taille de la largeur en fonction de telOuTab
    const width = telOuTab ? Math.floor(window.innerWidth * 0.8) : Math.floor(window.innerWidth * 0.4)

    const height= Math.floor(window.innerHeight * 0.7)
    const navigate = useNavigate()
    const [salleCouranteIndex, setSalleCourante] = useState(0)
    const [semaineCourante, setSemaineCourante] = useState(parseInt(week))
    const nomDesSalles = [
        "E01", "E02", "E06/E07", "E08", "E09", "E17", "E18", "E19",
        "ES1", "ES2", "ES4", "ES7", "ES8", "ES9"
    ]
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



    useEffect(() => {
        const nomSalle = decodeURIComponent(window.location.pathname.replace('/salle/', ''))
        const indexSalle = nomDesSalles.findIndex((nom) => nom === nomSalle)
        if (indexSalle !== -1) {
            setSalleCourante(indexSalle)
        }
    }, [nomDesSalles])

    const resetSemaineCouranteEtJourCourant = () => {
        setSemaineCourante(parseInt(sessionStorage.getItem('week')))
        setJourCourant(moment().startOf('day'))
    }

    const goToSallePrecedente = () => {
        const newIndex = salleCouranteIndex === 0 ? nomDesSalles.length - 1 : salleCouranteIndex - 1
        setSalleCourante(newIndex)
        navigate(`/salle/${encodeURIComponent(nomDesSalles[newIndex])}`)
        resetSemaineCouranteEtJourCourant()
    }

    const goToSalleSuivante = () => {
        const newIndex = salleCouranteIndex === nomDesSalles.length - 1 ? 0 : salleCouranteIndex + 1
        setSalleCourante(newIndex)
        navigate(`/salle/${encodeURIComponent(nomDesSalles[newIndex])}`)
        resetSemaineCouranteEtJourCourant()
    }

    const goToJourSuivant = () => {
        if (semaineCourante < nbweeks) {
            if (jourEnChiffre === 6) { // si samedi on va à lundi
                setSemaineCourante(semaineCourante + 1)
                setJourEnChiffre(1)
                setIdPianoDay(jours[jourEnChiffre].idPianoDay)
                setJourCourant(jourCourant.clone().add(2,'days'))
            }
            else {
                setJourEnChiffre(jourEnChiffre + 1)
                setIdPianoDay(jours[jourEnChiffre].idPianoDay)
                setJourCourant(jourCourant.clone().add(1,'days'))
            }
        }
    }

    const goToJourPrecedent = () => {
        if (semaineCourante > 0) {
            if (jourEnChiffre === 1) { // si lundi on va à samedi
                setSemaineCourante(semaineCourante - 1)
                setJourEnChiffre(6)
                setIdPianoDay(jours[jourEnChiffre].idPianoDay)
                setJourCourant(jourCourant.clone().subtract(2,'days'))
            }
            else {
                setJourEnChiffre(jourEnChiffre - 1)
                setIdPianoDay(jours[jourEnChiffre].idPianoDay)
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