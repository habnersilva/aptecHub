const fs = require("fs")
const state = require("./state")
const portalDoTricot = require("../api/portaldotricot")
const dateFormat = require("dateformat")

function _createVariables(content) {
  // Esta variaveis sera temporarias e sempre reclicadas
  content.temp.productsPortal = []
  content.temp.productsPortalPattern = []

  // A variavel products deve ser fixa
  if (typeof content.temp.products === "undefined") {
    content.temp.products = []
  }

  // A variavel products deve ser fixa
  if (typeof content.production.products === "undefined") {
    content.production.products = []
  }
}

const _fetchProducts = async content => {
  content.temp.productsPortal = await portalDoTricot
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
  const { brand } = content.temp
  try {
    content.temp.productsPortal.map(product => {
      const metafields = {}
      product.metafields.map(metafield => {
        metafields[metafield.key] = metafield
      })

      content.temp.productsPortalPattern.push({
        id: metafields.idaptechub.value,
        title: product.title,
        stage: "download",
        metafields
      })
    })
  } catch (err) {
    console.log(err)
  }
}

function organizeFileContent(content) {
  // Zerar productsOriginal
  delete content.temp.productsPortal
  delete content.temp.productsPortalPattern
}

function salveInTempProducts(content) {
  content.production.products = content.temp.productsPortalPattern
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
