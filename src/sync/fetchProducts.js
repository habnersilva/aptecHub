const aptecWeb = require("../api/aptecweb")
const state = require("./state")

function createVariables(content) {
  // Esta variaveis sera temporarias e sempre reclicadas
  content.temp.productsOriginal = []
  content.temp.productsPattern = []
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

async function fetchProducts(content) {
  content.temp.productsOriginal = await aptecWeb(
    content.temp.brand
  ).products.getAll()
}

function mapFieldsProductsPattern(content) {
  const { brand } = content.temp
  try {
    content.temp.productsOriginal.map(item => {
      let imageMain =
        item.WsprodutoImagem.filter(
          data => typeof data !== undefined && data.principal === "1"
        ).shift() || null

      let images = item.WsprodutoImagem.map(data => {
        return {
          id: data.id
        }
      })

      content.temp.productsPattern.push({
        id: item.Wsproduto.id,
        title: item.Wsproduto.nome,
        status: item.Wsproduto.situacao,
        description: item.Wsproduto.descricao,
        brand: brand.name,
        domain: brand.domain,
        slug: item.Wsproduto.slug,
        imageMain: imageMain,
        images,
        price: item.WsprodutoEstoque[0].valor_venda,
        sync: {
          status: "sought"
        }
      })
    })
  } catch (err) {
    console.log(err)
  }
}

function organizeFileContent(content) {
  // Zerar productsOriginal
  delete content.temp.productsPattern
  delete content.temp.productsOriginal
}

function hasUpdate(content) {
  console.log(content.temp.products)
}

function salveInTempProducts(content) {
  content.temp.products = content.temp.productsPattern
}

const init = async contentFilePath => {
  console.log("=> fetchProducts")

  const content = state.load(contentFilePath)

  createVariables(content)
  await fetchProducts(content)
  mapFieldsProductsPattern(content)
  // hasUpdate(content)
  salveInTempProducts(content)
  organizeFileContent(content)

  state.save(contentFilePath, content)
}
module.exports = init
