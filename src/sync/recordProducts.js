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

// function storeProducts(content) {
//   content.temp.products.forEach((productTemp, index) => {
//     if (
//       productTemp.import.status === "new" ||
//       productTemp.import.status === "modified"
//     ) {
//       // Remove Sync de temp
//       delete productTemp.sync
//       // Merge entre Objetos
//       productStore = {
//         ...content.products.products[index],
//         ...productTemp
//       }
//       content.products.products[index] = productStore
//     }
//   })
// }

function _storeProductsIfEmpty(content) {
  if (content.products.products.length <= 0) {
    content.products.products = content.temp.products
  }
}

// function deleteProducts(content) {
//   content.products.products.forEach((product, index) => {
//     console.log(product.import)
//     if (product.import.status === "delete") {
//       console.log(product.id)
//     }
//   })
// }

function clearFileTemp(content) {
  content.temp = {}
}

const init = async objContentFilesPath => {
  console.log("=> recordProducts")

  const content = state.load(objContentFilesPath)

  //deleteProducts(content)
  _storeProductsIfEmpty(content)
  //_storeProductsIfModified(content)
  //updateStatusSyncOfProducts(content)
  // clearFileTemp(content)

  state.save(objContentFilesPath, content)
}
module.exports = init
