const robots = {
  initContentFiles: require("./initContentFiles"),
  downloadProductsPortal: require("./downloadProductsPortal"),
  fetchXMLProducts: require("./fetchXMLProducts"),
  defineStageOfProducts: require("./defineStageOfProducts"),
  addCustomDataInProducts: require("./addCustomDataInProducts"),
  sendProducts: require("./sendProducts"),
  state: require("./state")
}

function _processStats(objContentFilesPath, status = "begin") {
  const content = robots.state.load(objContentFilesPath)

  const data = {
    products: {
      total: content.production.products.length,
      totalSynced: content.production.products.filter(
        product => product.sync.stage === "synced"
      ).length
    },
    process: {
      status
    }
  }

  content.production.stats = data

  robots.state.save(objContentFilesPath, content)
}

async function reset(brand, objContentFilesPath) {
  //console.log("=> resetContentFiles")

  const content = robots.state.load(objContentFilesPath)
  content.production.products = []
  robots.state.save(objContentFilesPath, content)

  await start(brand, objContentFilesPath)
}

function _checkIfItsInProcess(objContentFilesPath) {
  //console.log("=> _checkIfItsInProcess")
  const content = robots.state.load(objContentFilesPath)
  return content.production.stats.process.status
}

async function start(brand, objContentFilesPath) {
  console.log(`*** ${brand.id} - ${brand.name} ***`)

  // StartProcess
  robots.initContentFiles(brand, objContentFilesPath)
  if (_checkIfItsInProcess(objContentFilesPath) === "end") {
    _processStats(objContentFilesPath, "begin")
    await robots.downloadProductsPortal(objContentFilesPath)
    await robots.fetchXMLProducts(objContentFilesPath)
    // robots.addCustomDataInProducts(objContentFilesPath)
    // robots.defineStageOfProducts(objContentFilesPath)
    // await robots.sendProducts(objContentFilesPath)
    _processStats(objContentFilesPath, "end")
  }

  // const content = robots.state.load(objContentFilesPath)
  // console.log("\n>>>>>>>>>>> Product PRODUCTION ")
  // content.production.products.forEach(product => console.log(product.sync))
}

function load(brand, objContentFilesPath) {
  robots.initContentFiles(brand, objContentFilesPath)
  return robots.state.load(objContentFilesPath)
}

const init = brand => {
  const objContentFilesPath = {
    original: `./temp/${brand.id}_original.json`,
    production: `./temp/${brand.id}_production.json`
  }

  return {
    start: start.bind(null, brand, objContentFilesPath),
    reset: reset.bind(null, brand, objContentFilesPath),
    load: load.bind(null, brand, objContentFilesPath)
  }
}

module.exports = init
