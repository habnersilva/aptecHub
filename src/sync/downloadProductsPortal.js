const state = require("./state")
const portalDoTricot = require("../api/portaldotricot")
const moment = require("moment")

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
  content.production.productsPortal = await portalDoTricot
    .list_all_products({
      vendor: content.production.brand.name
    })
    .catch(err => {
      throw new Error(
        `Editando produto no Shopify\n     JSON ${JSON.stringify(
          params
        )}\n |--> ${err}`
      )
    })
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
        date_created: moment(product.created_at).format("YYYY-MM-DD HH:mm:ss"), // "2019-09-23 14:49:40",
        date_modified: moment(product.created_at).format("YYYY-MM-DD HH:mm:ss"), //"2019-11-06 08:55:58",
        sync: {
          stage: "synced",
          stage: "download",
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
 * @param {*} objContentFilesPath
 */
const init = async objContentFilesPath => {
  console.log("=> downlaodsProductsPortal")

  const content = state.load(objContentFilesPath)

  if (
    typeof content.production.products === "undefined" ||
    content.production.products.length <= 0
  ) {
    console.log(`---> Reset ${content.production.brand.name}`)

    _createVariables(content)
    await _fetchProducts(content)
    mapFieldsProductsPattern(content)
    salveInTempProducts(content)
    organizeFileContent(content)
  }

  state.save(objContentFilesPath, content)
}
module.exports = init
