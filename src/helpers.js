import proj4 from 'proj4'

/**
 * Compares two JSON objects and identifies added, removed, and changed keys.
 *
 * @param {Object} obj1 - The first JSON object.
 * @param {Object} obj2 - The second JSON object.
 * @returns {Object} Comparison result object.
 * @property {boolean} isDifferent - Indicates whether the two JSON objects are different.
 * @property {string[]} addedKeys - Array of keys added in the second object.
 * @property {string[]} removedKeys - Array of keys removed in the second object.
 * @property {string[]} changedKeys - Array of keys with changed values.
 * @async
 */
async function compareJSON(obj1, obj2) {
  const addedKeys = []
  const removedKeys = []
  const changedKeys = []
  const str1 = JSON.stringify(obj1)
  const str2 = JSON.stringify(obj2)
  const parsedObj1 = JSON.parse(str1)
  const parsedObj2 = JSON.parse(str2)

  for (const key in parsedObj1) {
    if (parsedObj1.hasOwnProperty(key)) {
      if (!parsedObj2.hasOwnProperty(key)) {
        removedKeys.push(key);
      } else if (JSON.stringify(parsedObj1[key]) !== JSON.stringify(parsedObj2[key])) {
        changedKeys.push(key);
      }
    }
  }

  for (const key in parsedObj2) {
    if (parsedObj2.hasOwnProperty(key) && !parsedObj1.hasOwnProperty(key)) {
      addedKeys.push(key);
    }
  }

  const isDifferent = !(JSON.stringify(obj1) === JSON.stringify(obj2))
  
  if (isDifferent) {

    return {
      isDifferent,
      addedKeys,
      removedKeys,
      changedKeys
    }
  }

  return { isDifferent }
}

/**
 * Converts coordinates from WGS84 (EPSG:4326) to Web Mercator (EPSG:3857).
 *
 * @param {number[]} coordinates - An array of WGS84 coordinates [lon, lat].
 * @returns {string} Converted coordinates in Web Mercator format.
 */
const convertCoordonnates = function(coordonates) {
  const sourceProjection = 'EPSG:4326'
  const targetProjection = 'EPSG:3857'
  const boundingBoxWGS84 = coordonates
  const boundingBox3857 = []
  for (let i = 0; i < boundingBoxWGS84.length; i += 2) {
    const lon = boundingBoxWGS84[i]
    const lat = boundingBoxWGS84[i + 1]
    const transformedCoords = proj4(sourceProjection, targetProjection, [lon, lat])
    boundingBox3857.push(transformedCoords[0], transformedCoords[1])
  }

  return boundingBox3857.join(',')
}

export {
  compareJSON,
  convertCoordonnates
}