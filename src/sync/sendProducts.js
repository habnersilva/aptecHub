const portalDoTricot = require("../api/portaldotricot")
const state = require("./state")
const moment = require("moment")

/**
 * @param {Object} content
 * @return {Object} product
 */
async function _create(product) {
  return await portalDoTricot.create_a_product(product).catch(err => {
    throw new Error(`Criando produto no PortaldoTricot\n |--> ${err}`)
  })
}

/**
 * @param {number} idportaldotricot
 * @return {Object} product
 */
async function _update(product) {
  return await portalDoTricot
    .update_a_product(product, product.sync.idportaldotricot)
    .catch(err => {
      throw new Error(
        `Editando produto ${product.id} - ${idportaldotricot} no PortaldoTricot\n |--> ${err}`
      )
    })
}

/**
 * @param {number} idportaldotricot
 * @return {Object} product
 */
async function _delete(idportaldotricot) {
  return await portalDoTricot.delete_a_product(idportaldotricot).catch(err => {
    throw new Error(
      `Excluindo produto ${idportaldotricot} no PortaldoTricot\n |--> ${err}`
    )
  })
}

/**
 *
 * @param {*} products
 * @param {*} stage
 */
function _filterStage(products, stage) {
  return products.filter(product => product.sync.stage === stage)
}

async function _sendProductsAndRetutrnSynced(productsToSync) {
  const total = productsToSync.length ? productsToSync.length : 10

  // precisa se sincrono para não estorar o limite de requisição no shopify
  for (index = 0; index < total; index++) {
    try {
      let productSynced = null
      let stage = "synced"

      if (productsToSync[index].sync.status === "new") {
        productSynced = await _create(productsToSync[index])
      } else if (productsToSync[index].sync.status === "modified") {
        productSynced = await _update(productsToSync[index])
      } else if (productsToSync[index].sync.status === "deleted") {
        stage = null
        productSynced = await _delete(
          productsToSync[index].sync.idportaldotricot
        )
      }

      if (!productSynced)
        throw new Error(
          "Não foi possível retorno o valor do produto sincronizado!"
        )

      if (!productSynced.metafields.link) {
        stage = "synced partial"
      }

      if (!productSynced.metafields.idaptechub) {
        stage = "synced partial"
      }

      productsToSync[index].sync = {
        stage,
        status: productsToSync[index].sync.status,
        idportaldotricot: productSynced.id,
        date: moment().format("DD/MM/YYYY HH:mm:ss"),
        metafields: { ...productSynced.metafields }
      }

      console.log(`${index} => ${productsToSync[index].id}`)
    } catch (err) {
      console.error(err)
    }
  }

  return productsToSync
}

/**
 * @param {*} content
 *
 */
async function sync(content) {
  const productsToSync = _filterStage(content.production.products, "to_sync")

  const productsSynced = await _sendProductsAndRetutrnSynced(productsToSync)

  content.production.products = content.production.products.map(
    productProduction => {
      const productSynced = productsSynced.find(
        productSynced => productSynced.id === productProduction.id
      )

      if (typeof productSynced !== "undefined") {
        return productSynced
      } else {
        return productProduction
      }
    }
  )
}

const init = async objContentFilesPath => {
  console.log("=> sendProducts")

  const content = state.load(objContentFilesPath)

  await sync(content)

  state.save(objContentFilesPath, content)
}
module.exports = init
