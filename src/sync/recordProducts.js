const state = require("./state")

function updateStatusSyncOfProducts(content) {
  content.production.products.forEach((product, index) => {
    if (product.import.status === "new" && product.sync.status === "init") {
      content.production.products[index].sync.status = "create"
    }

    if (
      product.import.status === "modified" &&
      product.sync.status !== "synced"
    ) {
      content.production.products[index].sync.status = "update"
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
//         ...content.production.products[index],
//         ...productTemp
//       }
//       content.production.products[index] = productStore
//     }
//   })
// }

function _storeProductsIfEmpty(content) {
  if (content.production.products.length <= 0) {
    content.production.products = content.temp.products
  }
}

// function deleteProducts(content) {
//   content.production.products.forEach((product, index) => {
//     console.log(product.import)
//     if (product.import.status === "delete") {
//       console.log(product.id)
//     }
//   })
// }

function clearFileTemp(content) {
  content.temp = {}
}

function _delete(content, productTemp) {
  content.production.products.forEach((product, index) => {
    if (product.id === productTemp.id) {
      content.production.products[index] = {
        ...product,
        ...productTemp
      }
    }
  })
}

function _update(content, productTemp) {
  content.production.products.forEach((product, index) => {
    if (product.id === productTemp.id) {
      content.production.products[index] = {
        ...product,
        ...productTemp
      }
    }
  })
}

function _storeProductsInProduction(content) {
  content.temp.products.forEach(productTemp => {
    if (productTemp.stage === "modified") {
      _update(content, productTemp)
    }

    if (productTemp.stage === "deleted") {
      _delete(content, productTemp)
    }

    if (productTemp.stage === "new") {
      content.production.products.push(productTemp)
    }
  })
}

const init = async objContentFilesPath => {
  console.log("=> recordProducts")

  const content = state.load(objContentFilesPath)

  _storeProductsInProduction(content)

  //deleteProducts(content)
  //_storeProductsIfEmpty(content)
  //_storeProductsIfModified(content)
  //updateStatusSyncOfProducts(content)
  // clearFileTemp(content)

  state.save(objContentFilesPath, content)
}
module.exports = init
