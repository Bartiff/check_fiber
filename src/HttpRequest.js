import axios from 'axios'

/**
 * Represents an HTTP request utility for making AJAX requests using Axios.
 *
 * @class HttpRequest
 */
class HttpRequest {

    /**
     * Creates an instance of the HttpRequest class.
     *
     * @constructor
     * @param {string} method - The HTTP method for the request ('GET' or 'POST').
     * @param {string} url - The URL for the HTTP request.
     * @param {Object} datas - The data to be sent with the request (for 'POST' requests).
     */
    constructor(method, url, datas) {
      this.method = method
      this.url = url
      this.datas = datas
    }

    /**
     * Sends the HTTP request using Axios.
     *
     * @async
     * @throws {Error} If the request encounters an error.
     * @returns {Promise<Object>} A promise that resolves to the response data.
     * @memberof HttpRequest
     * @instance
     */
    async send() {
      try {
          const response = (this.method === 'POST') 
            ? await axios.post(this.url, this.datas)
            : await axios.get(this.url, { params: this.datas })

          return response.data
      } catch (error) {
        console.error('Erreur lors de la requête ' + this.method + ' :', error)
        throw error
      }
    }
}

export default HttpRequest