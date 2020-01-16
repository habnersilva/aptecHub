const moment = require("moment")
const robots = {
  initContentFiles: require("./initContentFiles"),
  downloadProductsPortal: require("./downloadProductsPortal"),
  fetchXmlProducts: require("./fetchXmlProducts"),
  defineStageOfProducts: require("./defineStageOfProducts"),
  addCustomDataInProducts: require("./addCustomDataInProducts"),
  sendProducts: require("./sendProducts"),
  state: require("./state")
}

function _processStats(objContentFilesPath, status = "begin", action = "") {
  const content = robots.state.load(objContentFilesPath)

  let {
    downloadBeginTime,
    downloadEndTime,
    syncBeginTime,
    syncEndTime
  } = content.production.stats.process

  let terminalMsg = ""

  terminalMsg = `${content.production.brand.id} - ${content.production.brand.name}`

  if (status === "begin") {
    terminalMsg = terminalMsg.concat(` | ${action} => Start `)

    if (action === "download") {
      downloadBeginTime = moment().format("DD/MM/YYYY HH:mm:ss")
      terminalMsg = terminalMsg.concat(downloadBeginTime)
    }

    if (action === "sync") {
      syncBeginTime = moment().format("DD/MM/YYYY HH:mm:ss")
      terminalMsg = terminalMsg.concat(syncBeginTime)
    }
  }

  if (status === "end") {
    terminalMsg = terminalMsg.concat(` | ${action} => End `)

    if (action === "download") {
      downloadEndTime = moment().format("DD/MM/YYYY HH:mm:ss")
      terminalMsg = terminalMsg.concat(downloadEndTime)
    }

    if (action === "sync") {
      syncEndTime = moment().format("DD/MM/YYYY HH:mm:ss")
      terminalMsg = terminalMsg.concat(syncEndTime)
    }
  }

  const data = {
    products: {
      totalFetch: content.original.products.length,
      total: content.production.products.length,
      totalSynced: content.production.products.filter(
        product => product.sync.stage === "synced"
      ).length
    },
    process: {
      status,
      downloadBeginTime,
      downloadEndTime,
      syncBeginTime,
      syncEndTime
    }
  }

  content.production.stats = data

  console.log(terminalMsg)

  robots.state.save(objContentFilesPath, content)
}

function load(brand, objContentFilesPath) {
  robots.initContentFiles(brand, objContentFilesPath)
  return robots.state.load(objContentFilesPath)
}

async function reset(brand, objContentFilesPath) {
  //console.log("=> resetContentFiles")

  const content = robots.state.load(objContentFilesPath)
  content.production.products = []
  robots.state.save(objContentFilesPath, content)

  await start(brand, objContentFilesPath)
}

async function sync(objContentFilesPath) {
  const content = robots.state.load(objContentFilesPath)

  if (content.production.stats.process.status === "end") {
    _processStats(objContentFilesPath, "begin", "sync")
    await robots.sendProducts(objContentFilesPath)
    _processStats(objContentFilesPath, "end", "sync")
  } else {
    console.log("--> Cliente já está em Sync")
  }
}

async function download(objContentFilesPath) {
  _processStats(objContentFilesPath, "begin", "download")
  await robots.downloadProductsPortal(objContentFilesPath)
  await robots.fetchXmlProducts(objContentFilesPath)
  robots.addCustomDataInProducts(objContentFilesPath)
  robots.defineStageOfProducts(objContentFilesPath)
  _processStats(objContentFilesPath, "end", "download")
}

const init = brand => {
  const objContentFilesPath = {
    original: `./temp/${brand.id}_original.json`,
    production: `./temp/${brand.id}_production.json`
  }

  return {
    //  start: start.bind(null, brand, objContentFilesPath),
    reset: reset.bind(null, brand, objContentFilesPath),
    load: load.bind(null, brand, objContentFilesPath),
    sync: sync.bind(null, objContentFilesPath),
    download: download.bind(null, objContentFilesPath)
  }
}

module.exports = init
