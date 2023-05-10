import {useNavigate} from "react-router-dom"
import {useEffect, useState} from "react"
import moment from 'moment';
import 'moment/locale/fr';
import axios from "axios";


function ToutesLesSalles() {
    const identifier = sessionStorage.getItem('identifier')
    const projectId = sessionStorage.getItem('projectId')
    const week = sessionStorage.getItem('week')
    const nbweeks = sessionStorage.getItem('nbweeks')
    const width = Math.floor(window.innerWidth * 0.98)
    const height= Math.floor(window.innerHeight * 0.7)
    const [semaineCourante, setSemaineCourante] = useState(parseInt(week))
    const jours = [
        {jour: "dimanche", idPianoDay: "0"}, //pck JourActuel renvoe 0 pour diamanche
        {jour: "lundi", idPianoDay: "0"},
        {jour: "mardi", idPianoDay: "1"},
        {jour: "mercredi", idPianoDay: "2"},
        {jour: "jeudi", idPianoDay: "3"},
        {jour: "vendredi", idPianoDay: "4"},
        {jour: "samedi", idPianoDay: "5"},
    ]
    const [jourCourant, setJourCourant] = useState(moment().startOf('day'))
    const [jourEnChiffre, setJourEnChiffre] = useState(new Date().getDay()) //renvoie un nombre compris entre 0 (dimanche) et 6 (samedi)
    const [idPianoDay, setIdPianoDay] = useState(jours[jourEnChiffre].idPianoDay)
    const nomDesSalles = [
        "E01", "E02", "E06/E07", "E08", "E09", "E17", "E18", "E19",
        "ES1", "ES2", "ES4", "ES7", "ES8", "ES9"
    ]
    const [isLoading, setIsLoading] = useState(true)
    const [lesIdSalles, setLesIdSalles] = useState("")
    useEffect(() => {
        setIsLoading(true)

        const promises = nomDesSalles.map(nomSalle => {
            const storedIdSalle = sessionStorage.getItem(nomSalle)
            if (storedIdSalle) {
                return Promise.resolve()
            } else {
                return axios
                    .get(`http://localhost:5000/salle/${encodeURIComponent(nomSalle)}`)
                    .then(res => sessionStorage.setItem(nomSalle, res.data.id))
                    .catch(err => console.log(err))
            }
        })

        Promise.all(promises).then(() => {
            setIsLoading(false)
            setLesIdSalles(
                nomDesSalles.map(nomSalle => {
                    return encodeURIComponent(sessionStorage.getItem(nomSalle))
                }).join(",")
            )
        })
    }, [])

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

    const newImgUrl = `https://aderead.univ-orleans.fr/jsp/imageEt?identifier=${identifier}&projectId=${projectId}&idPianoWeek=${semaineCourante}&idPianoDay=${idPianoDay}&idTree=${lesIdSalles}&width=${width}&height=${height}&lunchName=REPAS&displayMode=1057855&showLoad=false&ttl=1683668533248&displayConfId=175`

    return (
        <div className="EmploiDuTempsSalle">
            <h3>Toutes les salles</h3>
            <div>
                <button className="boutonPrecSuiv" onClick={goToJourPrecedent}>Prec</button>
                <span>{jourCourant.format('dddd D MMMM').replace(/^\w/, c => c.toUpperCase())}</span>
                <button className="boutonPrecSuiv" onClick={goToJourSuivant}>Suiv</button>
            </div>
            <div className="emploi-du-temps-container">

                {isLoading ? (
                    <p>Chargement de l'emploi du temps en cours patientez...</p>
                ) : (
                    <img src={newImgUrl} alt="Probleme lors du chargement de l'emploi du temps" />
                )}

            </div>
        </div>
    );
}

export default ToutesLesSalles;