const state = require("./state")
const moment = require("moment")

/**
 *
 * @param {*} stage
 * @param {*} status
 */
function _markSyncCreate(stage, status) {
  return {
    stage: stage,
    status: status,
    date_synced: null
  }
}

function _createIfFileEmpty(content) {
  // Primeiro envio de produtos
  if (content.production.products.length <= 0) {
    for (index = 0; index < content.original.products.length; index++) {
      content.production.products.push({
        ...content.original.products[index],
        sync: {
          stage: "to_sync",
          status: "new"
        }
      })
    }
  }
}

/**
 *
 * @param {*} content
 */
function _checkForNewsProducts(content) {
  // Monto array apenas com os Ids dos produtos
  const arrayOfProducts = content.production.products.map(product => product.id)
  const arrayOfProductsOriginal = content.original.products.map(
    product => product.id
  )

  // Procuro pelos produto originais que não estão em prouction
  const arrayNewProducts = arrayOfProductsOriginal.filter(
    item => !arrayOfProducts.includes(item)
  )

  // Percorro a array add os novos produtos em productions
  if (arrayNewProducts.length > 0) {
    arrayNewProducts.forEach(idProduct => {
      const product = content.original.products.find(
        product => product.id === idProduct
      )
      product.sync = {
        stage: "to_sync",
        status: "new",
        date_synced: null
      }
      content.production.products.push(product)
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

      if (calculateDiffBetweenDates < 0) {
        productOriginal.sync = {
          ...productProduction.sync,
          stage: "to_sync",
          status: "modified"
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
          stage: "to_sync",
          status: "deleted"
        }
      }

      return productProduction
    }
  )
}

function _checkForUpdates(content) {
  // Verifica se a novos produtos
  _checkForNewsProducts(content)
  _checkForModifiedProducts(content)
  _checkForDeletedProducts(content)
}

const init = objContentFilesPath => {
  console.log("=> checkUpdate")
  const content = state.load(objContentFilesPath)

  const { products } = content.production

  if (products.length < 0) {
    _createIfFileEmpty(content)
  } else {
    _checkForUpdates(content)
  }

  state.save(objContentFilesPath, content)
}

module.exports = init
