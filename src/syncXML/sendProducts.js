const portalDoTricot = require("../api/portaldotricot")
const state = require("./state")
const moment = require("moment")

/**
 * @param {Object} content
 * @return {Object} productShopify
 */
async function _create(product) {
  let sync = {}
  try {
    const productShopify = await portalDoTricot.create_a_product(product)

    sync = {
      ...product.sync,
      stage: "synced",
      idportaldotricot: productShopify.id,
      date: moment().format("DD/MM/YYYY HH:mm:ss"),
      metafields: { ...productShopify.metafields },
      errors: ""
    }
  } catch (err) {
    sync = {
      ...product.sync,
      stage: "error",
      date: moment().format("DD/MM/YYYY HH:mm:ss"),
      errors: err.message
    }
  }

  // Retorna produto com sync atualizado
  return {
    ...product,
    sync
  }
}

/**
 * @param {*} products
 * @return {Object} productShopify
 */
async function _update(product) {
  let sync = {}
  try {
    const productShopify = await portalDoTricot.update_a_product(
      product,
      product.sync.idportaldotricot
    )
    sync = {
      ...product.sync,
      stage: "synced",
      idportaldotricot: productShopify.id,
      date: moment().format("DD/MM/YYYY HH:mm:ss"),
      metafields: { ...productShopify.metafields },
      errors: ""
    }
  } catch (err) {
    sync = {
      ...product.sync,
      stage: "error",
      date: moment().format("DD/MM/YYYY HH:mm:ss"),
      errors: err.message
    }
  }

  return {
    ...product,
    sync
  }
}

/**
 * @param {*} products
 * @return {Object} productShopify
 */
async function _delete(product) {
  let sync = {}
  try {
    await portalDoTricot.delete_a_product(product.sync.idportaldotricot)

    sync = {
      ...product.sync,
      stage: "",
      date: moment().format("DD/MM/YYYY HH:mm:ss"),
      errors: ""
    }
  } catch (err) {
    sync = {
      ...product.sync,
      stage: "error",
      date: moment().format("DD/MM/YYYY HH:mm:ss"),
      errors: err.message
    }
  }

  return {
    ...product,
    sync
  }
}

/**
 *
 * @param {*} content
 * @param {*} quantity
 */
function _filterProductsToSync(content, quantity) {
  content.production.shopify = content.production.products
    .filter(item => item.sync.stage === "to_sync")
    .filter((item, index) => index < quantity)
}

/**
 *
 * @param {*} products
 * @return {new:[], modified:[], deleted:[]}
 */
function _organizeProductsByStatus(content) {
  content.production.shopify = content.production.shopify.reduce(
    (prev, acc) => {
      prev[acc.sync.status].push(acc)
      return prev
    },
    { new: [], modified: [], delete: [] }
  )
}

/**
 *
 * @param {*} content
 */
async function _submit(content) {
  const productsSyncedNew = await _create(content.production.shopify.new)
  const productsSyncedModified = await _update(
    content.production.shopify.modified
  )
  const productsSyncedDeleted = await _delete(content.production.shopify.delete)

  content.production.shopify = [
    ...productsSyncedNew,
    ...productsSyncedModified,
    ...productsSyncedDeleted
  ]
}

async function _updateProduction(content) {
  const promises = content.production.products.map(async product => {
    if (product.sync.stage !== "synced") {
      switch (product.sync.status) {
        case "new":
          product = await _create(product)
          break
        case "modified":
          product = await _update(product)
          break
        case "deleted":
          product.published = false
          product = await _update(product)
          break
      }
    }
    return product
  })

  content.production.products = await Promise.all(promises)
}

/**
 *
 * @param {*} objContentFilesPath
 */
const init = async objContentFilesPath => {
  console.log("=> sendProducts")

  const content = state.load(objContentFilesPath)

  await _updateProduction(content)

  state.save(objContentFilesPath, content)
}
module.exports = init
