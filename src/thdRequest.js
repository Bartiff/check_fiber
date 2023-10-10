import axios from 'axios'

async function thdRequest(localization, maxSites) {
  try {
    const response = await axios.post('https://eligibilite-thd.fr/eligibilite-thd/api/public/sites/rip/coords/THDB', {
        latEast: localization.latEast,
        latWest: localization.latWest,
        lngNorth: localization.lngNorth,
        lngSouth: localization.lngSouth,
        statusFtth: ["ECE", "ECD", "SUS", "PDI", "DIS"],
        statusFtte: [],
        maxSites: maxSites,
        idZone: null
      })
    
    return response.data
  } catch (error) {
    console.error('Erreur lors de la requête GET :', error)
    throw error
  }
}

export { thdRequest }