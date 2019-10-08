const fs = require("fs")

function save(contentFilePath, content) {
  const contentString = JSON.stringify(content)
  return fs.writeFileSync(contentFilePath, contentString)
}

function load(contentFilePath) {
  if (!fs.existsSync(contentFilePath)) {
    save(contentFilePath, {})
  }

  const fileBuffer = fs.readFileSync(contentFilePath, "utf-8")
  const contentJson = JSON.parse(fileBuffer)
  return contentJson
}

module.exports = {
  save,
  load
}
