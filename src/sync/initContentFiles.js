const state = require("./state")

const init = (brand, objContentFilesPath) => {
  console.log("=> initContentFiles")

  const content = state.load(objContentFilesPath)

  const { id, name, domain, appKey } = brand
  content.temp.brand = { id, name, domain, appKey }
  content.products.brand = { id, name, domain, appKey }

  state.save(objContentFilesPath, content)
}

module.exports = init
