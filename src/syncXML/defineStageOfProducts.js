const state = require("./state")
const moment = require("moment")

/**
 *
 * @param {*} stage
 * @param {*} status
 */
function _buildSync(stage, status) {
  return {
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
  const arrayOfIdsProductsOriginal = content.original.products.map(
    product => product.id
  )

  // Procuro pelos Ids de produto originais que não estão em production
  const arrayOfIdsNewsProducts = arrayOfIdsProductsOriginal.filter(
    item => !arrayOfIdsProducts.includes(item)
  )

  if (arrayOfIdsNewsProducts.length > 0) {
    // Percorro a array add os novos produtos em productions
    content.production.products = arrayOfIdsNewsProducts.map(idProduct => {
      const product = content.original.products.find(
        product => product.id === idProduct
      )

      return {
        ...product,
        sync: _buildSync("to_sync", "new")
      }
    })
  }
}

/**
 *
 * @param {date_string} date1
 * @param {date_string} date2
 */
function _calculeDiffDates(date1, date2) {
  date1 = moment(date1)
  date2 = moment(date2)
  return date1.diff(date2, "minutes")
}

/**
 *
 * @param {*} content
 */
function _checkForModifiedProducts(content) {
  content.production.products = content.production.products.map(
    productProduction => {
      // Descarta se o status for igual a deleted
      if (productProduction.sync.status === "deleted") return productProduction

      const productOriginal = content.original.products.find(
        productOriginal => productOriginal.id === productProduction.id
      )

      // Descarta se productOriginal for undefinid,
      // caso: Se o produto foi deletedo no em original
      if (typeof productOriginal === "undefined") return productProduction

      // Encontra a diff entre outras,
      // ex -1 hora segnifica que date1 tem menor -1 hora para date2
      const calculateDiffBetweenDates = _calculeDiffDates(
        productProduction.date_modified,
        productOriginal.date_modified
      )

      if (
        calculateDiffBetweenDates < 0 &&
        (productProduction.sync.stage === "synced" ||
          productProduction.sync.stage === "download")
      ) {
        productOriginal.sync = {
          ...productProduction.sync,
          sync: _buildSync("to_sync", "modified")
        }

        return productOriginal
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

      if (
        typeof productOriginal === "undefined" &&
        productProduction.sync.stage === "synced"
      ) {
        productProduction.sync = {
          ...productProduction.sync,
          sync: _buildSync("to_sync", "to_sync")
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
