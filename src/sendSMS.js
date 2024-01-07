import axios from 'axios'

/**
 * Sends an SMS notification based on the differences in data.
 *
 * @param {string} provider - The name of the data provider.
 * @param {Object} datas - The comparison result object obtained from compareJSON.
 * @param {boolean} datas.isDifferent - Indicates whether the data has changed.
 * @param {string[]} datas.addedKeys - Array of keys added in the data.
 * @param {string[]} datas.removedKeys - Array of keys removed in the data.
 * @param {string[]} datas.changedKeys - Array of keys with changed values in the data.
 * @async
 * @throws {Error} If the SMS sending encounters an error.
 * @returns {Promise<Object>} A promise that resolves to the response data from the SMS API.
 */
async function sendSMS(provider, datas) {
  if (datas.isDifferent) {
    let message = provider + ' : ' + 'des changements ont eu lieu.'
    if (datas.addedKeys.length > 0) {
      message += ` - Ajouts : ${datas.addedKeys.join(', ')}`
    }
    if (datas.removedKeys.length > 0) {
      message += ` - Suppression : ${datas.removedKeys.join(', ')}`
    }
    if (datas.changedKeys.length > 0) {
      message += ` - Modifications : ${datas.changedKeys.join(', ')}`
    }
    console.info(message)

    // 10 second pause
    console.info('Waiting for 10 sec. to send the SMS...')
    await new Promise((resolve) => setTimeout(resolve, 10000))

    try {
      const response = await axios.post('https://smsapi.free-mobile.fr/sendmsg', {
        user: process.env.SMS_USER,
        pass: process.env.SMS_PASS,
        msg: message
      })
      
      return response.data
    } catch (error) {
      console.error('Erreur lors de l\'envoi du SMS :', error)
      throw error
    }
  } else {
    return {
      'success' : false,
      'message' : provider + ' n\'a pas publié de changements.'
    }
  }
}

export { sendSMS }