const state = require("./state")

/**
 *
 * @param {*} objProduct1
 * @param {*} objProduct2
 * @return {boolean} Retorna true para objetos iguais e false para objetos diferentes
 */
function _compareIfObjsProductsAreEquals(objProduct1, objProduct2) {
  // compara a diferença entre os produtos
  const objProductInString = Object.entries(objProduct1).toString()
  const objProduct2InString = Object.entries(objProduct2).toString()

  if (objProductInString === objProduct2InString) {
    return true
  } else {
    return false
  }
}

/**
 * @param {*} content
 * Identifica quais produtos foram deletados e salva stage "delete" no produto
 */
function _productsHaveBeenDeleted(content) {
  const arrayOfIdsDeleted = _whichProductsAreDifferent(content, [
    "products",
    "original"
  ])

  arrayOfIdsDeleted.forEach((item, index) => {
    if (item.response === "notexist")
      // o produto será EXCLUIDO, se o productTemp não existir em product
      content.temp.products[index].stage = "delete"
  })
}

// function _productsIsNew(content) {
//   const idsProductsInArray = content.products.products.map(
//     product => product.id
//   )
//   const idsProductsTempInArray = content.temp.products.map(
//     productTemp => productTemp.id
//   )

//   content.original.products.forEach(productOriginal => {
//     if (
//       !(
//         idsProductsInArray.includes(productOriginal.id) ||
//         idsProductsTempInArray.includes(productOriginal.id)
//       )
//     ) {
//       content.temp.products.push({
//         ...productOriginal,
//         stage: "new"
//       })
//     }
//   })
// }

/**
 * @param {*} content
 * @param Array<{products}, {products}> fileNames
 * @return !Array<{id:(number, status:(string))}>
 *  idProduct - Id do produto
 *  statuts - "equal" or "different"
 * */
function _compareAndReturnStatusOfProducts(content, fileNames) {
  const data = { notexists: [], equals: [], differents: [] }

  content[fileNames[0]].products.forEach(product1 => {
    const productFound =
      content[fileNames[1]].products.find(
        product2 => product2.id === product1.id
      ) || {}

    if (Object.keys(productFound).length === 0) {
      data.notexists.push(product1.id)
    } else if (_compareIfObjsProductsAreEquals(product1, productFound)) {
      data.equals.push(product1.id)
    } else if (!_compareIfObjsProductsAreEquals(product1, productFound)) {
      data.differents.push(product1.id)
    }
  })

  return data
}

function _setStageOfProduct(content, idProduct, stage) {
  if (stage === "deleted") {
    // Pega o produto em file Products pois em Temp não existe
    content.temp.products.push({
      ...content.products.products.find(product => product.id === idProduct),
      stage: "deleted"
    })
  } else {
    content.temp.products.map(productTemp => {
      if (productTemp.id === idProduct) {
        productTemp.stage = stage
        return productTemp
      }
    })
  }
}

function _checkAndSetStageProductTemp(content) {
  const idsProductsNewOrModified = _compareAndReturnStatusOfProducts(content, [
    "original",
    "products"
  ])

  const idsProductsDeleted = _compareAndReturnStatusOfProducts(content, [
    "products",
    "original"
  ])

  // Seta stage NEW em product Temp
  idsProductsNewOrModified.notexists.forEach(idProduct => {
    _setStageOfProduct(content, idProduct, "new")
  })

  // Seta stage MODIFIED em product Temp
  idsProductsNewOrModified.differents.forEach(idProduct => {
    _setStageOfProduct(content, idProduct, "modified")
  })

  // Seta stage DELETE em product Temp
  idsProductsDeleted.notexists.forEach(idProduct => {
    _setStageOfProduct(content, idProduct, "deleted")
  })
}

/**
 * @param {*} content
 * Identifica quais produtos foram deletados e salva stage "delete" no produto
 */
function _storeProductsInFileTemp(content) {
  content.temp.products = content.original.products
}

const init = objContentFilesPath => {
  console.log("=> checkUpdate")
  const content = state.load(objContentFilesPath)

  _storeProductsInFileTemp(content)
  _checkAndSetStageProductTemp(content)

  state.save(objContentFilesPath, content)
}

module.exports = init
