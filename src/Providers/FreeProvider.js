import Provider from './Provider.js'

/**
 * FreeProvider class extends the base Provider class, specializing in handling data
 * from the 'free' provider with specific configurations.
 *
 * @class FreeProvider
 * @extends {Provider}
 */
class FreeProvider extends Provider {

  /**
   * Creates an instance of the FreeProvider class.
   *
   * @constructor
   * @param {Object} [localization] - The localization parameters.
   * @param {number} [maxSites] - The maximum number of sites.
   */
  constructor(localization, maxSites) {
    super(localization, maxSites)
  }

  /**
   * Retrieves configuration data specific to the 'free' provider.
   *
   * @returns {Object} Configuration data for making requests to the 'free' provider.
   * @memberof FreeProvider
   * @instance
   */
  getDatas() {
    return {
      map: '/home/carto/data/mapserver/config/WFS_carto_service_ext.map',
      maxFeatures: this.maxSites,
      request: 'GetFeature',
      service: 'wfs',
      version: '1.1.0',
      outputformat: 'GEOJSON',
      typeName: 'deploiement_fibre',
      srsName: 'EPSG:4326',
      // maxExtent: '-575000,5055000,1270000,6650000',
      bbox: this.localization.lngNorth + ',' + this.localization.latEast + ',' + this.localization.lngSouth + ',' + this.localization.latWest,
    }
  }

  /**
   * Extracts and returns specific data from the response data for the 'free' provider.
   *
   * @param {string} provider_name - The name of the data provider.
   * @param {Object} response_datas - The response data from the 'free' provider.
   * @returns {Object[]} Specific data filtered based on the default IMB number.
   * @memberof FreeProvider
   * @instance
   */
  getSpecificDatas(provider_name, response_datas) {
    return response_datas.features
      .filter(feature => feature.properties.building_id === this.getDefaultImbNumber())
      .map(feature => feature.properties)
  }
}

export default FreeProvider