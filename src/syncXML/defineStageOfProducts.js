const state = require("./state")
const moment = require("moment")

/**
 *
 * @param {*} product1
 * @param {*} product2
 */
function _hasDiffBetweenObjects(p1, p2) {
  // Se eu fizer delete p2.sync ele apagará o sync de todas variaveis como productProduction
  const product1 = Object.assign({}, p1)
  delete product1.sync

  const product2 = Object.assign({}, p2)
  delete product2.sync

  return JSON.stringify(product1) !== JSON.stringify(product2) ? true : false
}

/**
 *
 * @param {*} stage
 * @param {*} status
 */
function _buildSync(sync, stage, status) {
  return {
    ...sync,
    stage: stage,
    status: status,
    date_synced: null,
    errors: []
  }
}

/**
 *
 * @param {*} content
 */
function _checkForNewsProducts(content) {
  // Monto array apenas com os Ids dos produtos
  const arrayOfIdsProducts = content.production.products.map(
    product => product.id
  )

  content.original.products.forEach(productOriginal => {
    if (!arrayOfIdsProducts.includes(productOriginal.id)) {
      content.production.products.push({
        ...productOriginal,
        sync: _buildSync({}, "to_sync", "new")
      })
    }
  })
}

/**
 *
 * @param {*} content
 */
function _checkForModifiedProducts(content) {
  content.production.products = content.production.products.map(
    productProduction => {
      // Descarta se o status for igual a deleted
      // if (productProduction.sync.status === "deleted") return productProduction

      const productOriginal = content.original.products.find(
        productOriginal =>
          parseInt(productOriginal.id) === parseInt(productProduction.id)
      )
      // Descarta se productOriginal for undefinid,
      // caso: Se o produto foi deletedo no em original
      if (typeof productOriginal === "undefined") {
        return productProduction
      }

      // Verifica se a diff os 2 produtos
      const diffBetweenProducts = _hasDiffBetweenObjects(
        productOriginal,
        productProduction
      )
      if (diffBetweenProducts) {
        const sync = _buildSync(productProduction.sync, "to_sync", "modified")
        return {
          ...productOriginal,
          sync
        }
      }

      return productProduction
    }
  )
}

/**
 *
 * @param {*} content
 */
function _checkForDeletedProducts(content) {
  content.production.products = content.production.products.map(
    productProduction => {
      const productOriginal = content.original.products.find(
        productOriginal => productOriginal.id === productProduction.id
      )

      // O produto deve estar sincronizado para realizar o delete não haverá erro
      if (
        typeof productOriginal === "undefined" &&
        productProduction.sync.stage != "deleted"
      ) {
        return {
          ...productProduction,
          sync: _buildSync(productProduction.sync, "to_sync", "deleted")
        }
      }

      return productProduction
    }
  )
}

/**
 *
 * @param {*} objContentFilesPath
 */
const init = objContentFilesPath => {
  console.log("=> defineStageOfProducts")

  const content = state.load(objContentFilesPath)

  // Verifica se a novos produtos
  _checkForNewsProducts(content)
  _checkForModifiedProducts(content)
  _checkForDeletedProducts(content)

  state.save(objContentFilesPath, content)
}

module.exports = init
