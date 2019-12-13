const portalDoTricot = require("../api/portaldotricot")
const state = require("./state")
const moment = require("moment")

/**
 * @param {Object} content
 * @return {Object} productShopify
 */
async function _create(products) {
  const promises = products.map(async product => {
    return await portalDoTricot.create_a_product(product).catch(err => {
      return {
        ...product,
        sync: { ...product.sync, errors: err.message }
      }
    })
  })

  return await Promise.all(promises)
}

/**
 * @param {*} products
 * @return {Object} productShopify
 */
async function _update(products) {
  const promises = products.map(async product => {
    return await portalDoTricot
      .update_a_product(product, product.sync.idportaldotricot)
      .catch(err => {
        return {
          ...product,
          sync: { ...product.sync, errors: err.message }
        }
      })
  })

  return await Promise.all(promises)
}

/**
 * @param {*} products
 * @return {Object} productShopify
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
    { new: [], modified: [], deleted: [] }
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
  const productsSyncedDeleted = await _delete(
    content.production.shopify.deleted
  )

  content.production.shopify = [
    ...productsSyncedNew,
    ...productsSyncedModified,
    ...productsSyncedDeleted
  ]
}

/**
 * Muda o stage do produto para Processing
 * @param {*} content
 */
function _changeStageToProcessing(content) {
  const arrayIdsOfProductsTemp = content.production.shopify.map(item => item.id)

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
function _changeStageToErrors(content) {
  content.production.products = content.production.products.map(product => {
    const productShopify = content.production.shopify.find(
      item => item.id === product.id
    )

    if (productShopify) {
      // Status expecifico para deleted
      product.sync = {
        ...product.sync,
        stage: "error",
        date: moment().format("DD/MM/YYYY HH:mm:ss"),
        errors: productShopify.sync.errors
      }
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
    const productShopify = content.production.shopify.find(item => {
      const idAptecHub = item.hasOwnProperty("metafields")
        ? item.metafields.idaptechub.value
        : 0

      if (parseInt(product.id) === parseInt(idAptecHub)) return item
    })

    if (productShopify) {
      // Status expecifico para deleted
      const stage = product.sync.status === "deleted" ? "deleted" : "synced"

      product.sync = {
        ...product.sync,
        stage,
        idportaldotricot: productShopify.id,
        date: moment().format("DD/MM/YYYY HH:mm:ss"),
        metafields: { ...productShopify.metafields }
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
  console.log("=> sendProducts")

  const content = state.load(objContentFilesPath)

  /*
   * Criar variavel shopify em content.production para retorno do dados do produtos conectados
   */

  /*
   *  Fraciona vetor de produtos em 10 em 10 para evitar estouro de requisição
   */
  _filterProductsToSync(content, 3)

  /*
   * Seta o Stage dos produtos em content.production.products para "processing"
   */
  // _changeStageToProcessing(content)

  /*
   * Organiza os produtos por status "new", "update", "delelte"
   * dentro de content.production.shopify
   */
  _organizeProductsByStatus(content)

  /*
   *  Enviar para shopify
   */
  await _submit(content)

  /**
   * Percorre shopify buscando errors
   */
  _changeStageToErrors(content)

  /*
   * Altera o Stage para synced se foi enviando com sucesso
   */
  _changeStageToSynced(content)

  state.save(objContentFilesPath, content)
}
module.exports = init
