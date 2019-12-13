const state = require("./state")
const fs = require("fs")

function _createFolderIfNotExist(folder) {
  fs.existsSync(folder) || fs.mkdirSync(folder)
}

const init = (brand, objContentFilesPath) => {
  //console.log("=> initContentFiles")

  _createFolderIfNotExist("temp")

  const content = state.load(objContentFilesPath)

  content.original.brand = brand
  content.production.brand = brand

  // A variavel products deve ser fixa
  if (typeof content.original.products === "undefined") {
    content.original.products = []
  }

  // A variavel products deve ser fixa
  if (typeof content.production.stats === "undefined") {
    content.production.stats = {
      products: {
        total: 0,
        totalSynced: 0
      },
      process: {
        status: "end"
      }
    }
  }

  if (typeof content.production.products === "undefined") {
    content.production.products = []
  }

  state.save(objContentFilesPath, content)
}

module.exports = init
