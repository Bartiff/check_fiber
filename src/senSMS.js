import axios from 'axios'

async function senSMS(provider, datas, config) {
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
    console.log(message)

    try {
      const response = await axios.post('https://smsapi.free-mobile.fr/sendmsg', {
        user: config.user,
        pass: config.pass,
        msg: message
      })
  
      return response.data
    } catch (error) {
      console.error('Erreur lors de l\'envoi du SMS :', error)
      throw error
    }
  } else {
    console.info(provider + ' n\'a pas publié de changements.')
  }

}

export { senSMS }