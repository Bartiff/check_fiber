import Provider from './Provider.js'

/**
 * ThdProvider class extends the base Provider class, specializing in handling data
 * from the 'thd' provider with specific configurations.
 *
 * @class ThdProvider
 * @extends {Provider}
 */
class ThdProvider extends Provider {

  /**
   * Creates an instance of the ThdProvider class.
   *
   * @constructor
   * @param {Object} [localization] - The localization parameters.
   * @param {number} [maxSites] - The maximum number of sites.
   */
  constructor(localization, maxSites) {
    super(localization, maxSites)
  }

  /**
   * Retrieves configuration data specific to the 'thd' provider.
   *
   * @returns {Object} Configuration data for making requests to the 'thd' provider.
   * @memberof ThdProvider
   * @instance
   */
  getDatas() {
    return {
      latEast: this.localization.latEast,
      latWest: this.localization.latWest,
      lngNorth: this.localization.lngNorth,
      lngSouth: this.localization.lngSouth,
      statusFtth: ["ECE", "ECD", "SUS", "PDI", "DIS"],
      statusFtte: [],
      maxSites: this.maxSites,
      idZone: null
    }
  }

  /**
   * Extracts and returns specific data from the response data for the 'thd' provider.
   *
   * @param {string} provider_name - The name of the data provider.
   * @param {Object} response_datas - The response data from the 'thd' provider.
   * @returns {Object[]} Specific data filtered based on the default IMB number.
   * @memberof ThdProvider
   * @instance
   */
  getSpecificDatas(provider_name, response_datas) {
    return response_datas
      .filter(record => record.dossier === this.getDefaultImbNumber())
      .map(record => record)
  }
}

export default ThdProvider