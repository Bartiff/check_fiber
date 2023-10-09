import fs from 'fs/promises'

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

export async function createDatasFile(datas, filename) {
  let existingDatas = null
  try {
    const contentFile = await fs.readFile('./datas/' + filename + '.json', 'utf-8')
    existingDatas = JSON.parse(contentFile)
  } catch (error) {
    existingDatas = {}
    await fs.writeFile('./datas/' + filename + '.json', JSON.stringify(existingDatas, null, 2), 'utf-8')
    // console.error(error)
  }
  const comparisonData = await compareJSON(existingDatas, datas)
  if (comparisonData.isDifferent) {
    await fs.writeFile('./datas/' + filename + '.json', JSON.stringify(datas, null, 2), 'utf-8')
  }
  
  return comparisonData
}

export async function pause(milliseconds) {
  
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}