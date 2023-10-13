import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import dotenv from 'dotenv'
import { freeRequest } from './src/freeRequest.js'
import { thdRequest } from './src/thdRequest.js'
import { sendSMS } from './src/sendSMS.js'
import { createDatasFile } from './src/helpers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: path.join(__dirname, '.env') })

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
        const promise = createDatasFile(feature.properties, __dirname + '/datas/freeDatas.json')
        freePromises.push(promise)
      }
    })
    const freeResponses = await Promise.all(freePromises)
    freeStatus = freeResponses.find(resp => resp !== null)
    const freeSms = await sendSMS('Free', freeStatus, sms_config)
    console.info(freeSms.message ? freeSms.message : 'Un SMS a été envoyé.')

    // Run the THD request
    const getThdResponse = await thdRequest(localization, maxSites)
    const thdPromises = []
    getThdResponse.forEach(async record => {
      if (record.dossier === imb_number) {
        const promise = createDatasFile(record,  __dirname + '/datas/thdDatas.json')
        thdPromises.push(promise)
      }
    })
    const thdResponses = await Promise.all(thdPromises)
    thdStatus = thdResponses.find(resp => resp !== null)
    const thdSms = await sendSMS('THD', thdStatus, sms_config)
    console.info(thdSms.message ? thdSms.message : 'Un SMS a été envoyé.')

  } catch (error) {
    console.error('Une erreur s\'est produite :', error)
  }
}

main()