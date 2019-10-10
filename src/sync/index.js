const robots = {
  initContentFiles: require("./initContentFiles"),
  fetchProducts: require("./fetchProducts"),
  updateProducts: require("./updateProducts"),
  recordProducts: require("./recordProducts"),
  sendProducts: require("./sendProducts"),
  state: require("./state")
}

async function start(brand, objContentFilesPath) {
  console.log("=> start")

  robots.initContentFiles(brand, objContentFilesPath)
  await robots.fetchProducts(objContentFilesPath)
  await robots.updateProducts(objContentFilesPath)
  await robots.recordProducts(objContentFilesPath)
  await robots.sendProducts(objContentFilesPath)

  const content = robots.state.load(objContentFilesPath)
  console.log("///////// Result ")
  //console.log(content)
  //console.log(content.products.products)
}

const init = brand => {
  const objContentFilesPath = {
    temp: `./tmp/${brand.id}_temp.json`,
    products: `./tmp/${brand.id}_products.json`
  }

  return {
    start: start.bind(null, brand, objContentFilesPath),
    load: robots.state.load.bind(null, objContentFilesPath)
  }
}

module.exports = init
