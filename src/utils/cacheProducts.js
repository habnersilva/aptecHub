const fs = require("fs")
const dateFormat = require("dateformat")
const byteFormat = require("bytes")
const aptecHubError = require("../errors")

const fileStats = filePath => {
  const stats = fs.statSync(filePath)
  return {
    sizeOriginal: stats.size,
    size: byteFormat(stats.size),
    dateMs: stats.birthtimeMs,
    date: dateFormat(stats.birthtimeMs, "dd/mm/yyyy h:MM:ss TT")
  }
}

const hasProductsCached = filePath => fs.existsSync(filePath)

const save = async (brand, content) => {
  const filePath = `./tmp/${brand.id}.json`

  const contentString = JSON.stringify(content)
  fs.writeFileSync(filePath, contentString)

  return await load(brand)
}

const load = async brand => {
  const filePath = `./tmp/${brand.id}.json`

  if (!hasProductsCached(filePath)) {
    throw new aptecHubError({
      errors: [
        {
          type: "danger",
          message: `Não existe arquivo cacheado para marca ${brand.name}`
        }
      ]
    })
  } else {
    const fileBuffer = fs.readFileSync(filePath, "utf-8")
    const contentJson = JSON.parse(fileBuffer)

    return {
      filePath,
      totalProducts: contentJson.length,
      stats: fileStats(filePath),
      data: contentJson
    }
  }
}

module.exports = {
  save,
  load
}
