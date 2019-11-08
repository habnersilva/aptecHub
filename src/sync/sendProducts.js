const portalDoTricot = require("../api/portaldotricot")
const state = require("./state")
const moment = require("moment")

/**
 * @param {Object} content
 * @return {Object} productSynced
 */
async function _create(products) {
  const promises = products.map(
    async product =>
      await portalDoTricot.create_a_product(product).catch(err => {
        throw new Error(
          `Criando ${product.id} produto no PortaldoTricot\n |--> ${err}`
        )
      })
  )

  return await Promise.all(promises)
}

/**
 * @param {*} products
 * @return {Object} productSynced
 */
async function _update(products) {
  const promises = products.map(
    async product =>
      await portalDoTricot
        .update_a_product(product, product.sync.idportaldotricot)
        .catch(err => {
          console.log(err)
          throw new Error(
            `Editando produto ${product.id} - ${product.sync.idportaldotricot} no PortaldoTricot\n |--> ${err}`
          )
        })
  )

  return await Promise.all(promises)
}

/**
 * @param {*} products
 * @return {Object} productSynced
 */
async function _delete(products) {
  const promises = products.map(async product => {
    const response = await portalDoTricot
      .delete_a_product(product.sync.idportaldotricot)
      .catch(err => {
        throw new Error(
          `Excluindo produto ${product.sync.idportaldotricot} no PortaldoTricot\n |--> ${err}`
        )
      })

    if (response === "deleted") {
      return {
        id: product.sync.idportaldotricot,
        metafields: product.sync.metafields
      }
    }
  })

  return await Promise.all(promises)
}

/**
 *
 * @param {*} content
 * @param {*} quantity
 */
function _filterProductsToSync(content, quantity) {
  content.production.temp = content.production.products
    .filter(item => item.sync.stage === "to_sync")
    .filter((item, index) => index < quantity)
}

/**
 *
 * @param {*} products
 * @return {new:[], modified:[], deleted:[]}
 */
function _organizeProductsByStatus(content) {
  content.production.temp = content.production.temp.reduce(
    (prev, acc) => {
      prev[acc.sync.status].push(acc)
      return prev
    },
    { new: [], modified: [], deleted: [] }
  )
}

/**
 *
 * @param {*} content
 */
async function _shipper(content) {
  const productsSyncedNew = await _create(content.production.temp.new)
  const productsSyncedModified = await _update(content.production.temp.modified)
  const productsSyncedDeleted = await _delete(content.production.temp.deleted)

  content.production.temp = [
    ...productsSyncedNew,
    ...productsSyncedModified,
    ...productsSyncedDeleted
  ]
}
/**
 *
 * @param {*} content
 */
function _changeStageToProcessing(content) {
  const arrayIdsOfProductsTemp = content.production.temp.map(item => item.id)

  content.production.products = content.production.products.map(product => {
    if (arrayIdsOfProductsTemp.indexOf(product.id) >= 0) {
      product.sync.stage = "processing"
    }

    return product
  })
}

/**
 *
 * @param {*} content
 */
function _changeStageToSynced(content) {
  content.production.products = content.production.products.map(product => {
    const productSynced = content.production.temp.find(item => {
      return item.metafields.idaptechub.value === product.id
    })

    if (productSynced) {
      // Status expecifico para deleted
      const stage = product.sync.status === "deleted" ? "deleted" : "synced"

      product.sync = {
        stage,
        status: product.sync.status,
        idportaldotricot: productSynced.id,
        date: moment().format("DD/MM/YYYY HH:mm:ss"),
        metafields: { ...productSynced.metafields }
      }
    }

    return product
  })
}

/**
 *
 * @param {*} objContentFilesPath
 */
const init = async objContentFilesPath => {
  //console.log("=> sendProducts")

  const content = state.load(objContentFilesPath)

  _filterProductsToSync(content, 10)
  _changeStageToProcessing(content)
  _organizeProductsByStatus(content)
  await _shipper(content)
  _changeStageToSynced(content)

  state.save(objContentFilesPath, content)
}
module.exports = init
