const axios = require("axios")
const https = require("https")
const express = require("express")
const path = require("path")
const app = express()

app.use(express.json())

app.use(express.static("../client/build"))



let week = ""
let projectId = ""
let nbweeks = ""

/**
 * Initalise le projectId, week et nbweeks en les recuperant de l'ade
 * @returns {Promise<{week: string, projectId: string}|{week: (*|string), projectId: (*|string)}>}
 */
async function initProjectIdEtSemaineEtNbWeeks() {
    const url = "https://www.univ-orleans.fr/EDTWeb/?action=displayFilieres&composantes=SCT&filieres=12741"
    try {
        const response = await axios.get(url, { httpsAgent: new https.Agent({ rejectUnauthorized: false }) })
        const data = response.data
        week = data.split("weeks=")[1].split('"')[0]
        projectId = data.split("projectId=")[1].split("&")[0]

        const nbweeksDebutIndex = data.indexOf('<select name="week"')
        const nbweeksFinIndex = data.indexOf('</select>', nbweeksDebutIndex)
        const nbweeksOptions = data.slice(nbweeksDebutIndex, nbweeksFinIndex)
        nbweeks = nbweeksOptions.split('<option').length - 2 // -1 pour 0

        console.log("semaine = " + week)
        console.log("projectId = " + projectId)
        console.log("nbweeks = " + nbweeks)
        return { week, projectId }
    } catch (error) {
        console.log(error)
        return { week: "", projectId: "" }
    }
}

/**
 * Recuper l'identifier en recuperant un jsession et l'utilisant pour recuper un identifier
 * @returns {Promise<*|string>}
 */
async function recupIdentifier() {
    const url = "https://aderead.univ-orleans.fr/jsp/custom/modules/plannings/direct_planning.jsp?days=0%2C1%2C2%2C3%2C4%2C5&displayConfName=ENT&height=700&login=etuWeb&password=&projectId="
        + projectId + "&resources=6402&showOptions=false&showPianoDays=false&showPianoWeeks=false&showTree=false&weeks=4"
    try {
        //recupere le JSESSIONID
        const response = await axios.get(url, {httpsAgent: new https.Agent({ rejectUnauthorized: false })})
        const jsessionid = response.headers['set-cookie'][0].split(';')[0].split('=')[1]
        console.log("JSESSIONID = " + jsessionid)
        //recupere l'identifier
        const urlImg = "https://aderead.univ-orleans.fr/jsp/custom/modules/plannings/imagemap.jsp?clearTree=true&width=150&height=150"
        const options = {
            headers: {
                'Cookie': `JSESSIONID=${jsessionid}`
            },
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        }
        const imgResponse = await axios.get(urlImg, options)
        const imgData = imgResponse.data
        const identifier = imgData.split("identifier=")[1].split("&")[0]
        console.log("Identifier = " + identifier)
        return identifier
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error)
        return ""
    }
}

/**
 * Recupere l'id d'une salle donnée
 * @param nomSalle
 * @returns {Promise<*|string>}
 */
async function recupIdSalle(nomSalle) {
    //url de aderead mais sans l'emploie du temps
    const url = "https://aderead.univ-orleans.fr/jsp/standard/gui/tree.jsp?login=etuWeb&password&projectId="
        + projectId + "&xyz=1668727897997&what0=boolean%3BIs+Room%3BIS_CLASSROOM&how0=true&getText0=&what1=string%3BName%3BNAME&how1=equals&getText1="
        + nomSalle + "&what2=-1&how2=contains&getText2=&what3=-1&how3=contains&getText3=&what4=-1&how4=contains&getText4=&filterId=-1&nbFilters=5&nbLines=5&bigTree=null&isDirect="
    try {
        const response = await axios.get(url, { httpsAgent: new https.Agent({ rejectUnauthorized: false }) })
        const data = response.data
        const id = data.split(":check(")[2].split(", 'true')")[0]
        console.log("Nom de la salle " + nomSalle )
        console.log("Id de la salle = " + id)
        return id
    } catch (error) {
        console.log(error)
        return ""
    }
}


/**
 * Retourne un json qui contien le nom de la salle et son id
 */
app.get('/api/salle/*', async (req, res) => {
    const nomSalle = req.params[0]
    const idSalle = await recupIdSalle(nomSalle)

    res.send({
        nom: nomSalle,
        id: idSalle,
    })
})

/**
 * Retourne un json avec le projectId, week, identifier et nbweeks
 */
app.get("/api/accueil", async (_, res) => {
    const identifier = await recupIdentifier()
    console.log()

    res.send({
        projectId: projectId,
        week: week,
        identifier: identifier,
        nbweeks: nbweeks,
    })
})

// route catch-all pour rediriger vers l'application React.js
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"))
})

app.listen(5000, () => {
    console.log("Serveur démarré sur le port 5000")
    initProjectIdEtSemaineEtNbWeeks()
})
