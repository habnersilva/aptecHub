const robots = {
  initContentFiles: require("./initContentFiles"),
  downloadProductsPortal: require("./downloadProductsPortal"),
  fetchProducts: require("./fetchProducts"),
  updateProducts: require("./updateProducts"),
  recordProducts: require("./recordProducts"),
  sendProducts: require("./sendProducts"),
  state: require("./state")
}

async function reset(brand, objContentFilesPath) {
  console.log("=> resetContentFiles")

  const content = robots.state.load(objContentFilesPath)

  content.temp = {}
  content.production.products = []

  robots.state.save(objContentFilesPath, content)

  start(brand, objContentFilesPath)
}

async function start(brand, objContentFilesPath) {
  console.log("**********************")
  console.log(`${brand.id} - ${brand.name}`)
  console.log("**********************")
  console.log("=> start")

  robots.initContentFiles(brand, objContentFilesPath)
  await robots.downloadProductsPortal(objContentFilesPath)
  await robots.fetchProducts(objContentFilesPath)
  await robots.updateProducts(objContentFilesPath)
  await robots.recordProducts(objContentFilesPath)
  await robots.sendProducts(objContentFilesPath)

  const content = robots.state.load(objContentFilesPath)
  // console.log(">>>>>>>>>>> Product ORIGINAL ")
  // content.original.products.forEach(productOriginal =>
  //   console.log(`${productOriginal.id} (${productOriginal.title})`)
  // )
  // console.log(">>>>>>>>>>> Product TEMP ")
  // content.temp.products.forEach(productTemp =>
  //   console.log(
  //     ` => ${productTemp.stage} ---- ${productTemp.id} (${productTemp.title})`
  //   )
  // )
  // console.log("\n>>>>>>>>>>> Product PRODUCTION ")
  // content.production.products.forEach(product =>
  //   console.log(` => ${product.stage} ---- ${product.id} (${product.title})`)
  // )
}

const init = brand => {
  const objContentFilesPath = {
    original: `./tmp/${brand.id}_original.json`,
    temp: `./tmp/${brand.id}_temp.json`,
    production: `./tmp/${brand.id}_production.json`
  }

  return {
    start: start.bind(null, brand, objContentFilesPath),
    reset: reset.bind(null, brand, objContentFilesPath),
    load: robots.state.load.bind(null, objContentFilesPath)
  }
}

module.exports = init
