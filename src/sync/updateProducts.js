const state = require("./state")

// function productIsNew(content) {
//   content.temp.products.forEach((productTemp, index) => {
//     const productCurrent = content.products.products.find(
//       product => product.id === productTemp.id
//     )

//     if (productCurrent === undefined || productCurrent === "undefined") {
//       content.temp.products[index].import.status = "new"
//     }
//   })
// }

function productHasUpdate(content) {
  content.temp.products.forEach((productTemp, index) => {
    const productCurrent = content.products.products.find(
      product => product.id === productTemp.id
    )

    // Apenas comparo os produtos se existe produto atual
    if (productCurrent === undefined || productCurrent === "undefined") {
      content.temp.products[index].import.status = "new"
    } else {
      const productCurrentInString = Object.entries(productCurrent).toString()
      const productTempInString = Object.entries(productTemp).toString()

      if (productCurrentInString != productTempInString) {
        content.temp.products[index].import.status = "modified"
      } else {
        content.temp.products[index].import.status = ""
      }
    }
  })
}

const init = objContentFilesPath => {
  console.log("=> checkUpdate")
  const content = state.load(objContentFilesPath)

  // productIsNew(content)
  productHasUpdate(content)

  state.save(objContentFilesPath, content)
}
module.exports = init
