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

async function _updateProduction(content, limit = 10) {
  let i = limit
  const productsLimited = content.production.products.filter(item => {
    if (item.sync.stage === "to_sync" && i > 0) {
      i--
      return item
    }
  })

  const promises = productsLimited.map(async product => {
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
    return product
  })

  const productsSended = await Promise.all(promises)
  // Resolver merge do que foi enviado para Shopify com base atual

  content.production.products = content.production.products.map(product => {
    const productFinded = productsSended.find(item => item.id === product.id)
    return {
      ...product,
      ...productFinded
    }
  })
}

/**
 *
 * @param {*} objContentFilesPath
 */
const init = async objContentFilesPath => {
  // console.log("---> sendProducts")

  const content = await state.load(objContentFilesPath)
  await _updateProduction(content, 10)
  await state.save(objContentFilesPath, content)
}
module.exports = init
