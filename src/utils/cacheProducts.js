const fs = require("fs")
const dateFormat = require("dateformat")
const byteFormat = require("bytes")

function save(marca, content) {
  const filePath = `./tmp/${marca.id}.json`

  const contentString = JSON.stringify(content)
  return fs.writeFileSync(filePath, contentString)
}

function fileExist(filePath) {
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.F_OK, err => {
      if (err) {
        console.error(err)
        return reject(err)
      }
      //file exists
      resolve()
    })
  })
}
const detailsCache = path => {
  const stats = fs.statSync(path)
  return {
    sizeOriginal: stats.size,
    size: byteFormat(stats.size),
    dateMs: stats.birthtimeMs,
    date: dateFormat(stats.birthtimeMs, "dd/mm/yyyy h:MM:ss TT")
  }
}
const hasProductsCached = filePath => fs.existsSync(path)
const hasProductsUpdate = () => {}

const load = async marca => {
  const path = `./tmp/${marca.id}.json`

  if (!hasProductsCached) {
    throw new Error("Não existe produtos cacheados")
  } else {
    const fileBuffer = fs.readFileSync(path, "utf-8")
    const contentJson = JSON.parse(fileBuffer)

    return {
      totalProducts: contentJson.length,
      details: detailsCache(path),
      hasProductsCached,
      hasProductsUpdate: false,
      data: contentJson
    }
  }
}

module.exports = {
  save,
  load
}
