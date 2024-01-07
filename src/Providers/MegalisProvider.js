import Provider from './Provider.js'
import { convertCoordonnates } from '../helpers.js'

/**
 * MegalisProvider class extends the base Provider class, specializing in handling data
 * from the 'megalis' provider with specific configurations.
 *
 * @class MegalisProvider
 * @extends {Provider}
 */
class MegalisProvider extends Provider {

  /**
   * Creates an instance of the MegalisProvider class.
   *
   * @constructor
   * @param {Object} [localization] - The localization parameters.
   * @param {number} [maxSites] - The maximum number of sites.
   */
  constructor(localization, maxSites) {
    super(localization, maxSites)
  }

  /**
   * Retrieves configuration data specific to the 'megalis' provider.
   *
   * @returns {Object} Configuration data for making requests to the 'megalis' provider.
   * @memberof MegalisProvider
   * @instance
   */
  getDatas() {
    return {
      REQUEST: 'GetFeatureInfo',
      QUERY_LAYERS: 'suivi_adresse',
      INFO_FORMAT: 'application/json',
      FEATURE_COUNT: this.maxSites,
      I: 188,
      J: 223,
      WIDTH: 256,
      HEIGHT: 256,
      CRS: 'EPSG:3857',
      BBOX: convertCoordonnates([parseFloat(this.localization.lngSouth), parseFloat(this.localization.latWest), parseFloat(this.localization.lngNorth), parseFloat(this.localization.latEast)]),
      LAYERS: 'suivi_adresse'
    }
  }

  /**
   * Extracts and returns specific data from the response data for the 'megalis' provider.
   *
   * @param {string} provider_name - The name of the data provider.
   * @param {Object} response_datas - The response data from the 'megalis' provider.
   * @returns {Object[]} Specific data filtered based on the default IMB number.
   * @memberof MegalisProvider
   * @instance
   */
  getSpecificDatas(provider_name, response_datas) {
    return response_datas.features
      .filter(feature => feature.properties.ref_technique === this.getDefaultImbNumber())
      .map(feature => feature.properties)
  }
}

export default MegalisProvider