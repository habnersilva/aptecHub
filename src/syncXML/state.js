const fs = require("fs")

function save(objContentFilesPath, content) {
  const data = {}

  Object.keys(objContentFilesPath).forEach(nameFile => {
    const contentFilePath = objContentFilesPath[nameFile]
    data[nameFile] = saveOne(contentFilePath, content[nameFile])
  })

  return data
}

function saveOne(contentFilePath, content) {
  const contentString = JSON.stringify(content)
  return fs.writeFileSync(contentFilePath, contentString)
}

function load(objContentFilesPath) {
  const data = {}

  Object.keys(objContentFilesPath).forEach(nameFile => {
    const contentFilePath = objContentFilesPath[nameFile]

    if (!fs.existsSync(contentFilePath)) {
      saveOne(contentFilePath, {})
    }

    const fileBuffer = fs.readFileSync(contentFilePath, "utf-8")
    const contentJson = JSON.parse(fileBuffer)
    data[nameFile] = contentJson
  })

  return data
}

module.exports = {
  save,
  load
}
