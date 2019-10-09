const state = require("./state")

const init = async objContentFilesPath => {
  console.log("=> recordProducts")

  const content = state.load(objContentFilesPath)

  content.temp.products.forEach((productTemp, index) => {
    if (
      productTemp.sync.status === "new" ||
      productTemp.sync.status === "modified"
    ) {
      content.products.products[index] = productTemp
    }
  })

  state.save(objContentFilesPath, content)
}
module.exports = init
