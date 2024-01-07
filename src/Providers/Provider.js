import fs from 'fs/promises'
import { compareJSON } from '../helpers.js'

/**
 * Represents a generic provider for data processing and management.
 *
 * @class Provider
 */
class Provider {

  /**
   * Creates an instance of the Provider class.
   *
   * @constructor
   * @param {Object} [localization] - The localization parameters.
   * @param {number} [maxSites] - The maximum number of sites.
   * @param {string} [imbNumber] - The default IMB number.
   */
  constructor(localization, maxSites, imbNumber) {
    this.localization = localization || this.getDefaultLocalization()
    this.maxSites = maxSites || this.getDefaultMaxSites()
    this.imbNumber = imbNumber || this.getDefaultImbNumber()
  }

  /**
   * Gets the default localization parameters.
   *
   * @returns {Object} The default localization parameters.
   * @memberof Provider
   * @instance
   * @protected
   */
  getDefaultLocalization() {
    return {
      latEast: process.env.LAT_EAST,
      latWest: process.env.LAT_WEST,
      lngNorth: process.env.LNG_NORTH,
      lngSouth: process.env.LNG_SOUTH,
    }
  }

  /**
   * Gets the default maximum number of sites.
   *
   * @returns {number} The default maximum number of sites.
   * @memberof Provider
   * @instance
   * @protected
   */
  getDefaultMaxSites() {
    return process.env.MAX_SITES
  }

  /**
   * Gets the default IMB number.
   *
   * @returns {string} The default IMB number.
   * @memberof Provider
   * @instance
   * @protected
   */
  getDefaultImbNumber() {
    return process.env.IMB_NUMBER
  }

  /**
   * Creates a data file for a specific provider based on response data.
   *
   * @param {string} provider_name - The name of the data provider.
   * @param {Object} response_datas - The response data from the provider.
   * @returns {Object} The status of the data file creation.
   * @memberof Provider
   * @instance
   * @async
   */
  async createDatasFile(provider_name, response_datas) {
    try {
      const Promises = await this.formatDatasProvider(provider_name, response_datas)
      const freeResponses = await Promise.all(Promises)
      const status = freeResponses.find(resp => resp !== null)

      return status
    } catch (error) {
      console.error('Erreur lors de la création du fichier de données ' + provider_name + ' : ' + error)

      return { status: false, message : error }
    }
  }

  /**
   * Formats data for a specific provider and returns an array of promises for writing to files.
   *
   * @param {string} provider_name - The name of the data provider.
   * @param {Object} response_datas - The response data from the provider.
   * @returns {Promise[]} An array of promises for writing data to files.
   * @memberof Provider
   * @instance
   * @async
   * @protected
   */
  async formatDatasProvider(provider_name, response_datas) {
    const Promises = []
    const specificDatas = this.getSpecificDatas(provider_name, response_datas)

    specificDatas.forEach(async (data) => {
      const promise = this.writeFile(data, `./datas/${provider_name}Datas.json`)
      Promises.push(promise)
    })

    return Promises
  }

  /**
   * Writes data to a file, comparing and updating if necessary.
   *
   * @param {Object} datas - The data to be written.
   * @param {string} filepath - The file path where the data should be stored.
   * @returns {Object} A comparison result indicating whether the data has changed.
   * @memberof Provider
   * @instance
   * @async
   */
  async writeFile(datas, filepath) {
    let existingDatas = null
    try {
      const contentFile = await fs.readFile(filepath, 'utf-8')
      existingDatas = JSON.parse(contentFile)
    } catch (error) {
      existingDatas = {}
      await fs.writeFile(filepath, JSON.stringify(existingDatas, null, 2), 'utf-8')
      // console.error(error)
    }
    const comparisonData = await compareJSON(existingDatas, datas)

    if (comparisonData.isDifferent) {
      await fs.writeFile(filepath, JSON.stringify(datas, null, 2), 'utf-8')
    }
    
    return comparisonData
  }

  /**
   * Abstract method to be implemented by subclasses for provider-specific data formatting.
   *
   * @abstract
   * @param {string} provider_name - The name of the data provider.
   * @param {Object} response_datas - The response data from the provider.
   * @returns {Object[]} The specific data formatted for the given provider.
   * @memberof Provider
   * @instance
   * @protected
   */
  getSpecificDatas(provider_name, response_datas) {
    throw new Error('La méthode getSpecificDatas doit être implémentée dans chaque fournisseur.');
  }
}

export default Provider