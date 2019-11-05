const robots = {
  initContentFiles: require("./initContentFiles"),
  downloadProductsPortal: require("./downloadProductsPortal"),
  fetchProducts: require("./fetchProducts"),
  updateProducts: require("./updateProducts"),
  sendProducts: require("./sendProducts"),
  state: require("./state")
}

function _processStats(objContentFilesPath, status = "begin") {
  console.log("=> _processStats - " + status)

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
  console.log("=> resetContentFiles")

  const content = robots.state.load(objContentFilesPath)
  content.production.products = []
  robots.state.save(objContentFilesPath, content)
  start(brand, objContentFilesPath)
}

function _checkIfItsInProcess(objContentFilesPath) {
  console.log("=> _checkIfItsInProcess")
  const content = robots.state.load(objContentFilesPath)
  return content.production.stats.process.status
}

async function start(brand, objContentFilesPath) {
  console.log("**********************")
  console.log(`${brand.id} - ${brand.name}`)
  console.log("**********************")
  console.log("=> start")

  // StartProcess
  if (_checkIfItsInProcess(objContentFilesPath) === "end") {
    robots.initContentFiles(brand, objContentFilesPath)
    _processStats(objContentFilesPath, "begin")
    await setTimeout(async function() {
      //await robots.downloadProductsPortal(objContentFilesPath)
      await robots.fetchProducts(objContentFilesPath)
      robots.updateProducts(objContentFilesPath)
      await robots.sendProducts(objContentFilesPath)
      _processStats(objContentFilesPath, "end")
    }, 5000)
  }
  //  const content = robots.state.load(objContentFilesPath)
  // console.log("\n>>>>>>>>>>> Product PRODUCTION ")
  // content.production.products.forEach(product =>
  //   console.log(
  //     ` => ${product.sync.stage} ---- ${product.id} (${product.title})`
  //   )
  // )
}

function load(brand, objContentFilesPath) {
  robots.initContentFiles(brand, objContentFilesPath)
  return robots.state.load(objContentFilesPath)
}

const init = brand => {
  const objContentFilesPath = {
    original: `./tmp/${brand.id}_original.json`,
    production: `./tmp/${brand.id}_production.json`
  }

  return {
    start: start.bind(null, brand, objContentFilesPath),
    reset: reset.bind(null, brand, objContentFilesPath),
    load: load.bind(null, brand, objContentFilesPath)
  }
}

module.exports = init
