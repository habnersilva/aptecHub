const fs = require("fs")
const state = require("./state")
const portalDoTricot = require("../api/portaldotricot")

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

function mapFieldsProductsPattern(content) {
  const { brand } = content.production
  try {
    content.production.productsPortal.map(product => {
      const metafields = {}
      product.metafields.map(metafield => {
        metafields[metafield.key] = metafield
      })

      content.production.productsPortalPattern.push({
        id: metafields.idaptechub.value,
        title: product.title,
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

function organizeFileContent(content) {
  // Zerar productsOriginal
  delete content.production.productsPortal
  delete content.production.productsPortalPattern
}

function salveInTempProducts(content) {
  content.production.products = content.production.productsPortalPattern
}

const init = async objContentFilesPath => {
  console.log("=> downlaodsProductsPortal")

  const content = state.load(objContentFilesPath)

  if (
    typeof content.production.products === "undefined" ||
    content.production.products.length <= 0
  ) {
    console.log("+++> Rodou!")

    _createVariables(content)
    await _fetchProducts(content)
    mapFieldsProductsPattern(content)
    salveInTempProducts(content)
    organizeFileContent(content)
  }

  state.save(objContentFilesPath, content)
}
module.exports = init
