import dotenv from 'dotenv'
import { freeRequest } from './src/freeRequest.js'
import { thdRequest } from './src/thdRequest.js'
import { senSMS } from './src/senSMS.js'
import { createDatasFile, pause } from './src/helpers.js'

dotenv.config()
const imb_number = process.env.IMB_NUMBER
const sms_config = {
  'user' : process.env.SMS_USER,
  'pass' : process.env.SMS_PASS,
}
const localization = {
  latEast : process.env.LAT_EAST,
  latWest : process.env.LAT_WEST,
  lngNorth : process.env.LNG_NORTH,
  lngSouth : process.env.LNG_SOUTH,
}
const maxSites = process.env.MAX_SITES

async function main() {
  let freeStatus = null
  let thdStatus = null

  try {
    // Run the Free request
    const getFreeResponse = await freeRequest(localization, maxSites)
    const freePromises = []
    getFreeResponse.features.forEach(async feature => {
      if (feature.properties.building_id === imb_number) {
        const promise = createDatasFile(feature.properties, 'freeDatas')
        freePromises.push(promise)
      }
    })
    const freeResponses = await Promise.all(freePromises)
    freeStatus = freeResponses.find(resp => resp !== null)
    await senSMS('Free', freeStatus, sms_config)

    // 10 second pause
    await pause(10000)

    // Run the THD request
    const getThdResponse = await thdRequest(localization, maxSites)
    const thdPromises = []
    getThdResponse.forEach(async record => {
      if (record.dossier === imb_number) {
        const promise = createDatasFile(record, 'thdDatas')
        thdPromises.push(promise)
      }
    })
    const thdResponses = await Promise.all(thdPromises)
    thdStatus = thdResponses.find(resp => resp !== null)
    await senSMS('THD', thdStatus, sms_config)

  } catch (error) {
    console.error('Une erreur s\'est produite :', error)
  }
}

main()