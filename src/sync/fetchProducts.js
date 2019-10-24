const aptecWeb = require("../api/aptecweb")
const state = require("./state")
const dateFormat = require("dateformat")

function _createVariables(content) {
  // Esta variaveis sera temporarias e sempre reclicadas
  content.original.productsOriginal = []
  content.original.productsPattern = []
}

async function fetchProducts(content) {
  content.original.productsOriginal = await aptecWeb(
    content.original.brand
  ).products.getAll()
}

function mapFieldsProductsPattern(content) {
  const { brand } = content.original
  try {
    content.original.productsOriginal.map(item => {
      let imageMain =
        item.WsprodutoImagem.filter(
          data => typeof data !== undefined && data.principal === "1"
        ).shift() || null

      let images = item.WsprodutoImagem.map(data => {
        return {
          id: data.id
        }
      })

      content.original.productsPattern.push({
        id: item.Wsproduto.id,
        title: item.Wsproduto.nome,
        status: item.Wsproduto.situacao,
        description: item.Wsproduto.descricao,
        brand: brand.name,
        domain: brand.domain,
        slug: item.Wsproduto.slug,
        imageMain: imageMain,
        images,
        price: item.WsprodutoEstoque[0].valor_venda
      })
    })
  } catch (err) {
    console.log(err)
  }
}

function organizeFileContent(content) {
  // Zerar productsOriginal
  delete content.original.productsPattern
  delete content.original.productsOriginal
}

function salveInTempProducts(content) {
  content.original.products = content.original.productsPattern
}

const init = async objContentFilesPath => {
  console.log("=> fetchProducts")

  const content = state.load(objContentFilesPath)

  _createVariables(content)
  await fetchProducts(content)
  mapFieldsProductsPattern(content)
  salveInTempProducts(content)
  organizeFileContent(content)

  state.save(objContentFilesPath, content)
}
module.exports = init
