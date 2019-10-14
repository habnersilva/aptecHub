const fs = require("fs")
const state = require("./state")
const portalDoTricot = require("../api/portaldotricot")

function _createVariables(content) {
  // Esta variaveis sera temporarias e sempre reclicadas
  content.temp.productsPortal = []
  content.temp.productsPortalPattern = []
  content.products.data = []

  // A variavel products deve ser fixa
  if (typeof content.temp.products === "undefined") {
    content.temp.products = []
  }

  // A variavel products deve ser fixa
  if (typeof content.products.products === "undefined") {
    content.products.products = []
  }
}

const _fetchProducts = async content => {
  try {
    content.temp.productsPortal = await portalDoTricot.list_all_products({
      vendor: content.products.brand.name
    })
  } catch (err) {
    console.error(err)
  }
}

function mapFieldsProductsPattern(content) {
  const { brand } = content.temp
  try {
    content.temp.productsPortal.map(product => {
      console.dir(product, { detph: null })
      process.exit(0)
      // let imageMain =
      //   product.WsprodutoImagem.filter(
      //     data => typeof data !== undefined && data.principal === "1"
      //   ).shift() || null

      // let images = product.WsprodutoImagem.map(data => {
      //   return {
      //     id: data.id
      //   }
      // })

      content.temp.productsPattern.push({
        id: product.id,
        title: product.title,
        // status: product.Wsproduto.situacao,
        description: product.body_html,
        brand: brand.name,
        domain: brand.domain,
        slug: product.metafields.filter(item => item.key === link),
        imageMain: product.image,
        images: product.images,
        price: product.WsprodutoEstoque[0].valor_venda,
        import: {
          status: "init",
          date: dateFormat(new Date(), "dd-mm-yyyy HH:MM:ss")
        },
        sync: {
          status: "download",
          date: dateFormat(new Date(), "dd-mm-yyyy HH:MM:ss"),
          id: product.id
        }
      })
    })
  } catch (err) {
    console.log(err)
  }
}

const _clearProducts = content => {
  content.products.products = []
}

const _countProducts = async content => {
  const products = await portalDoTricot.count_all_products({
    vendor: content.products.brand.name
  })
  console.log(products)
}

const init = async objContentFilesPath => {
  console.log("=> downlaodsProductsPortal")

  const content = state.load(objContentFilesPath)

  // _countProducts(content)
  // _clearProducts(content)

  _createVariables(content)
  await _fetchProducts(content)
  mapFieldsProductsPattern(content)
  // salveInTempProducts(content)
  // organizeFileContent(content)

  console.log(content.products.products)

  state.save(objContentFilesPath, content)
}
module.exports = init
