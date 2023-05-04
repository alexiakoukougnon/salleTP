const fetch = require('node-fetch')
const https = require('https')
const express = require('express');
const app = express();
const cors = require('cors')

app.use(cors({
  //origin: "*" vue par tout le monde
  origin: "http://localhost:3000"
}))


let jsession = ''

async function recupIdSalle(nomSalle) {
  const url = "https://aderead.univ-orleans.fr/jsp/standard/gui/tree.jsp?login=etuWeb&password&projectId=0&xyz=1668727897997&what0=boolean%3BIs+Room%3BIS_CLASSROOM&how0=true&getText0=&what1=string%3BName%3BNAME&how1=equals&getText1="
      + nomSalle + "&what2=-1&how2=contains&getText2=&what3=-1&how3=contains&getText3=&what4=-1&how4=contains&getText4=&filterId=-1&nbFilters=5&nbLines=5&bigTree=null&isDirect="
  try {
    const response = await fetch(url, { agent: new https.Agent({ rejectUnauthorized: false }) })
    const data = await response.text()
    const id = data.split(":check(")[2].split(", 'true')")[0]
    console.log("La salle " + nomSalle + " a un id de " + id)
    return id
  } catch (error) {
    console.log(error)
    return ""
  }
}


async function recupIdentifier() {
  const url = "https://aderead.univ-orleans.fr/jsp/custom/modules/plannings/imagemap.jsp?clearTree=true&width=150&height=150";
  const options = {
    method: 'GET',
    headers: {
      'Cookie': 'JSESSIONID=' + jsession
    },
    agent: new https.Agent({ rejectUnauthorized: false })
  }
  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.text()
    const identifier = data.split("identifier=")[1].split("&")[0];
    console.log(identifier)
    return identifier
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    return ""
  }
}


async function recupJsession() {
  const url = "https://aderead.univ-orleans.fr/jsp/custom/modules/plannings/direct_planning.jsp?days=0%2C1%2C2%2C3%2C4%2C5&displayConfName=ENT&height=700&login=etuWeb&password=&projectId=0&resources=6402&showOptions=false&showPianoDays=false&showPianoWeeks=false&showTree=false&weeks=4"

  try {
    const response = await fetch(url, { agent: new https.Agent({ rejectUnauthorized: false }) })
    const jsessionid = response.headers.get('set-cookie').split(';')[0].split('=')[1]
    jsession = jsessionid
    console.log("JSESSIONID = " + jsession)
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
  }
}


app.get('/salle/:nomSalle', async (req, res) => {
  const nomSalle = req.params.nomSalle
  const idSalle = await recupIdSalle(nomSalle)
  await recupJsession()
  const identifier = await recupIdentifier()

  res.json({
    nom: nomSalle,
    id: idSalle,
    ident: identifier,
  })

})


app.listen(4000, () => {
  console.log('Serveur démarré sur le port 4000')
})








