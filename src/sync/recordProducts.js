const state = require("./state")

function updateStatusSyncOfProducts(content) {
  content.products.products.forEach((product, index) => {
    if (product.import.status === "new" && product.sync.status === "init") {
      content.products.products[index].sync.status = "create"
    }

    if (
      product.import.status === "modified" &&
      product.sync.status !== "synced"
    ) {
      content.products.products[index].sync.status = "update"
    }
  })
}

function storeProducts(content) {
  content.temp.products.forEach((productTemp, index) => {
    if (
      productTemp.import.status === "new" ||
      productTemp.import.status === "modified"
    ) {
      content.products.products[index] = productTemp
    }
  })
}

const init = async objContentFilesPath => {
  console.log("=> recordProducts")

  const content = state.load(objContentFilesPath)

  storeProducts(content)
  updateStatusSyncOfProducts(content)

  state.save(objContentFilesPath, content)
}
module.exports = init
