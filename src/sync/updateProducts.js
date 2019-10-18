const state = require("./state")

function productHasUpdate(content) {
  content.temp.products.forEach((productTemp, index) => {
    const productPublished = content.products.products.find(
      product => product.id === productTemp.id
    )

    // Apenas comparo os produtos se existe produto atual
    if (productPublished === undefined || productPublished === "undefined") {
      content.temp.products[index].import.status = "new"
    } else {
      // compara a diferença entre os produtos
      const productPublishedInString = Object.entries(
        productPublished
      ).toString()
      const productTempInString = Object.entries(productTemp).toString()

      if (productPublished.sync.status === "download") {
        //console.log("++++> Status download")
        content.temp.products[index].import.status = "modified"
        content.temp.products[index].sync = productPublished.sync
      } else if (productPublishedInString != productTempInString) {
        //console.log("++++> Status modified")
        content.temp.products[index].import.status = "modified"
      } else {
        //console.log("++++> Status null")
        content.temp.products[index].import.status = ""
      }
    }
  })
}

const init = objContentFilesPath => {
  console.log("=> checkUpdate")
  const content = state.load(objContentFilesPath)

  productHasUpdate(content)

  state.save(objContentFilesPath, content)
}
module.exports = init
