const state = require("./state")

const init = (brand, objContentFilesPath) => {
  console.log("=> initContentFiles")

  const content = state.load(objContentFilesPath)

  const { id, name, domain, appKey } = brand
  content.original.brand = { id, name, domain, appKey }
  content.temp.brand = { id, name, domain, appKey }
  content.production.brand = { id, name, domain, appKey }

  // A variavel products deve ser fixa
  content.temp.products = []

  // A variavel products deve ser fixa
  if (typeof content.original.products === "undefined") {
    content.original.products = []
  }

  // A variavel products deve ser fixa
  if (typeof content.production.products === "undefined") {
    content.production.products = []
  }

  state.save(objContentFilesPath, content)
}

module.exports = init
