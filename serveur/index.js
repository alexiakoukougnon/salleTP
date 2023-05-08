const axios = require("axios")
const express = require("express")
const https = require('https')
const app = express()
const cors = require('cors')

app.use(cors({
  //origin: "*" vue par tout le monde
  origin: "http://localhost:3000"
}))


let week = ""
let projectId = ""
let nbweeks = ""

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

app.get('/salle/:nomSalle', async (req, res) => {
  const nomSalle = req.params.nomSalle
  const idSalle = await recupIdSalle(nomSalle)
  console.log()

  res.json({
    nom: nomSalle,
    id: idSalle,
  })
})

app.get("/accueil", async (req, res) => {
  try {
    const identifier = await recupIdentifier()
    console.log()

    res.json({
      projectId: projectId,
      week: week,
      identifier: identifier,
      nbweeks: nbweeks,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send("Erreur interne du serveur")
  }
})

app.listen(5000, () => {
  console.log("Serveur démarré sur le port 5000")
  initProjectIdEtSemaineEtNbWeeks()
})
