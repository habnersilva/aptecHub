const robots = {
  initContentFiles: require("./initContentFiles"),
  fetchProducts: require("./fetchProducts"),
  state: require("./state")
}

async function start(brand, objContentFilesPath) {
  console.log("=> Start ")

  robots.initContentFiles(brand, objContentFilesPath)
  await robots.fetchProducts(objContentFilesPath)

  const content = robots.state.load(objContentFilesPath)
  console.log("///////// Result ")
  console.log(content)
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
