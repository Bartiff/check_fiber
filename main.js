import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import HttpRequest from './src/HttpRequest.js'
import FreeProvider from './src/Providers/FreeProvider.js'
import ThdProvider from './src/Providers/ThdProvider.js'
import MegalisProvider from './src/Providers/MegalisProvider.js'
import { sendSMS } from './src/sendSMS.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: `${__dirname}/.env` })

async function main() {
  try {
    // Run the Free request
    const free = new FreeProvider()
    const freeDatas = free.getDatas()
    const freeRequest = new HttpRequest('GET', 'https://www.free.fr/carte_fibre/cgi/ext/mapserv.cgi', freeDatas)
    const freeResponse = await freeRequest.send()
    const freeStatus = await free.createDatasFile('free', freeResponse)
    const freeSms = await sendSMS('Free', freeStatus)
    console.info(freeSms.message ? freeSms.message : 'Un SMS a été envoyé.')

    // Run the THD request
    const thd = new ThdProvider()
    const thdDatas = thd.getDatas()
    const thdRequest = new HttpRequest('POST', 'https://eligibilite-thd.fr/eligibilite-thd/api/public/sites/rip/coords/THDB', thdDatas)
    const thdResponse = await thdRequest.send()
    const thdStatus = await thd.createDatasFile('thd', thdResponse)
    const thdSms = await sendSMS('THD', thdStatus)
    console.info(thdSms.message ? thdSms.message : 'Un SMS a été envoyé.')

    // Run the Megalis request
    const megalis = new MegalisProvider()
    const megalisDatas = megalis.getDatas()
    const megalisRequest = new HttpRequest('GET', 'https://geobretagne.fr/geoserver/megalis/wms', megalisDatas)
    const megalisResponse = await megalisRequest.send()
    const megalisStatus = await megalis.createDatasFile('megalis', megalisResponse)
    const megalisSms = await sendSMS('Megalis', megalisStatus)
    console.info(megalisSms.message ? megalisSms.message : 'Un SMS a été envoyé.')

  } catch (error) {
    console.error('Une erreur s\'est produite :', error)
  }
}

main()