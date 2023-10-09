import axios from 'axios'

async function thdRequest() {
  try {
    const response = await axios.post('https://eligibilite-thd.fr/eligibilite-thd/api/public/sites/rip/coords/THDB', {
        latEast: 48.13983458890648,
        latWest: 48.137804827036454,
        lngNorth: -1.965825745066847,
        lngSouth: -1.9687278952209608,
        statusFtth: ["ECE", "ECD", "SUS", "PDI", "DIS"],
        statusFtte: [],
        maxSites: 7000,
        idZone: null
      })
    
    return response.data
  } catch (error) {
    console.error('Erreur lors de la requête GET :', error)
    throw error
  }
}

export { thdRequest }