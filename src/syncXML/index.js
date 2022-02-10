const moment = require("moment-timezone");
const { get } = require('lodash');
const portalDoTricot = require("../api/portaldotricot");
const robots = {
  initContentFiles: require("./initContentFiles"),
  reset: require("./reset"),
  fetchXmlProducts: require("./fetchXmlProducts"),
  defineStageOfProducts: require("./defineStageOfProducts"),
  addCustomDataInProducts: require("./addCustomDataInProducts"),
  unionProductsGroup: require("./unionProductsGroup"),
  sendProducts: require("./sendProducts"),
  state: require("./state")
};

async function _checkSync(objContentFilesPath) {
  const content = await robots.state.load(objContentFilesPath);

  if (get(content, 'production.stats.process.status', '') === "begin") {
    console.log("--> Cliente já está em Sync");
    return true;
  } else {
    return false;
  }
}

async function _processStats(
  objContentFilesPath,
  status = "begin",
  action = ""
) {
  const content = await robots.state.load(objContentFilesPath);

  let {
    downloadBeginTime,
    downloadEndTime,
    syncBeginTime,
    syncEndTime
  } = content.production.stats.process;

  let terminalMsg = "";

  terminalMsg = `${content.production.brand.id} - ${content.production.brand.name}`;

  if (status === "begin") {
    terminalMsg = terminalMsg.concat(` | ${action} => Start `);

    if (action === "download") {
      downloadBeginTime = moment().format("DD/MM/YYYY HH:mm:ss");
      terminalMsg = terminalMsg.concat(downloadBeginTime);
    }

    if (action === "sync") {
      syncBeginTime = moment().format("DD/MM/YYYY HH:mm:ss");
      terminalMsg = terminalMsg.concat(syncBeginTime);
    }
  }

  if (status === "end") {
    terminalMsg = terminalMsg.concat(` | ${action} => End `);

    if (action === "download") {
      downloadEndTime = moment().format("DD/MM/YYYY HH:mm:ss");
      terminalMsg = terminalMsg.concat(downloadEndTime);
    }

    if (action === "sync") {
      syncEndTime = moment().format("DD/MM/YYYY HH:mm:ss");
      terminalMsg = terminalMsg.concat(syncEndTime);
    }
  }

  const data = {
    products: {
      totalFetch: content.original.products.length,
      total: content.production.products.length,
      totalSynced: content.production.products.filter(
        product => product.sync.stage === "synced"
      ).length,
      totalPortaldoTricot: await portalDoTricot.count_all_products({
        vendor: content.production.brand.name
      })
    },
    process: {
      status,
      downloadBeginTime,
      downloadEndTime,
      syncBeginTime,
      syncEndTime
    }
  };

  content.production.stats = data;

  console.log(terminalMsg);

  await robots.state.save(objContentFilesPath, content);
}

async function load(brand, objContentFilesPath) {
  await robots.initContentFiles(brand, objContentFilesPath);
  const content = robots.state.load(objContentFilesPath);
  return content
}

async function reset(brand, objContentFilesPath) {
  const syncStatus = await _checkSync(objContentFilesPath);
  if (syncStatus) return false;

  await _processStats(objContentFilesPath, "begin", "reset");
  await robots.reset(objContentFilesPath);
  await _processStats(objContentFilesPath, "end", "reset");
}

async function sync(objContentFilesPath) {
  const syncStatus = await _checkSync(objContentFilesPath);
  if (syncStatus) return false;

  await _processStats(objContentFilesPath, "begin", "sync");
  await robots.sendProducts(objContentFilesPath);
  await _processStats(objContentFilesPath, "end", "sync");
}

async function download(objContentFilesPath) {
  _processStats(objContentFilesPath, "begin", "download");
  await robots.fetchXmlProducts(objContentFilesPath);
  await robots.unionProductsGroup(objContentFilesPath);
  await robots.addCustomDataInProducts(objContentFilesPath);
  await robots.defineStageOfProducts(objContentFilesPath);
  await _processStats(objContentFilesPath, "end", "download");
}

const init = brand => {
  const objContentFilesPath = {
    original: `${brand.id}_original.json`,
    production: `${brand.id}_production.json`
  };

  return {
    //  start: start.bind(null, brand, objContentFilesPath),
    reset: reset.bind(null, brand, objContentFilesPath),
    load: load.bind(null, brand, objContentFilesPath),
    sync: sync.bind(null, objContentFilesPath),
    download: download.bind(null, objContentFilesPath)
  };
};

module.exports = init;
