const state = require("./state")
const fs = require("fs")
const portalDoTricot = require("../api/portaldotricot")

const init = async (brand, objContentFilesPath) => {
  //console.log("=> initContentFiles")

  const content = await state.load(objContentFilesPath)

  content.original.brand = brand
  content.production.brand = brand

  // A variavel products deve ser fixa
  if (typeof content.original.products === "undefined") {
    content.original.products = []
    content.original.source = []
  }

  // A variavel products deve ser fixa
  if (typeof content.production.stats === "undefined") {
    content.production.stats = {
      products: {
        totalFetch: 0,
        total: 0,
        totalSynced: 0,
        totalPortaldoTricot: await portalDoTricot.count_all_products({
          vendor: content.production.brand.name
        })
      },
      process: {
        status: "end"
      }
    }
  }

  if (typeof content.production.products === "undefined") {
    content.production.products = []
  }

  await state.save(objContentFilesPath, content)
}

module.exports = init
