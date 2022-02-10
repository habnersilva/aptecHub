const state = require("./state")
const portalDoTricot = require("../api/portaldotricot")
const moment = require("moment-timezone")

/**
 *
 * @param {*} content
 */
function _createVariables(content) {
  // Esta variaveis sera temporarias e sempre reclicadas
  content.production.productsPortal = []
  content.production.productsPortalPattern = []

  // A variavel products deve ser fixa
  if (typeof content.production.products === "undefined") {
    content.production.products = []
  }

  // A variavel products deve ser fixa
  if (typeof content.production.products === "undefined") {
    content.production.products = []
  }
}

/**
 *
 * @param {*} content
 */
const _fetchProducts = async content => {
  try {
    content.production.productsPortal = await portalDoTricot.list_all_products({
      vendor: content.production.brand.name
    })
  } catch (err) {
    console.error(err)
  }
}

/**
 *
 * @param {*} content
 */
function mapFieldsProductsPattern(content) {
  try {
    content.production.productsPortal.map(product => {
      const metafields = {}
      product.metafields.map(metafield => {
        metafields[metafield.key] = metafield
      })

      content.production.productsPortalPattern.push({
        id: metafields.idaptechub.value,
        title: product.title,
        tags: product.tags,
        published_at: product.published_at,
        sync: {
          stage: "download",
          date: moment(product.created_at).format("YYYY-MM-DD HH:mm:ss"), // "2019-09-23 14:49:40",
          idportaldotricot: product.id,
          metafields
        }
      })
    })
  } catch (err) {
    console.log(err)
  }
}

/**
 *
 * @param {*} content
 */
function organizeFileContent(content) {
  // Zerar productsOriginal
  delete content.production.productsPortal
  delete content.production.productsPortalPattern
}

/**
 *
 * @param {*} content
 */
function salveInTempProducts(content) {
  content.production.products = content.production.productsPortalPattern
}

/**
 *
 * @param {*} content
 */
function clearProductionProducts(content) {
  content.production.products = []
}

/**
 *
 * @param {*} objContentFilesPath
 */
const init = async objContentFilesPath => {
  // console.log("---> downlaodsProductsPortal")

  const content = await state.load(objContentFilesPath)

  _createVariables(content)
  clearProductionProducts(content)
  await _fetchProducts(content)
  mapFieldsProductsPattern(content)
  salveInTempProducts(content)
  organizeFileContent(content)

  await state.save(objContentFilesPath, content)
}

module.exports = init
