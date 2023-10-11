import axios from 'axios'

async function freeRequest(localization, maxSites) {
  try {
    const response = await axios.get('https://www.free.fr/carte_fibre/cgi/ext/mapserv.cgi', {
      params: {
        map: '/home/carto/data/mapserver/config/WFS_carto_service_ext.map',
        maxFeatures: maxSites,
        request: 'GetFeature',
        service: 'wfs',
        version: '1.1.0',
        outputformat: 'GEOJSON',
        typeName: 'deploiement_fibre',
        srsName: 'EPSG:4326',
        // maxExtent: '-575000,5055000,1270000,6650000',
        bbox: localization.lngNorth + ',' + localization.latEast + ',' + localization.lngSouth + ',' + localization.latWest,
      },
    })
    
    return response.data
  } catch (error) {
    console.error('Erreur lors de la requête GET :', error)
    throw error
  }
}

export { freeRequest }