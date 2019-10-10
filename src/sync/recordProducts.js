const state = require("./state")

const init = async objContentFilesPath => {
  console.log("=> recordProducts")

  const content = state.load(objContentFilesPath)

  content.temp.products.forEach((productTemp, index) => {
    if (
      productTemp.import.status === "new" ||
      productTemp.import.status === "modified"
    ) {
      content.products.products[index] = productTemp
      content.products.products[index].sync.status = "waiting"
    }
  })

  state.save(objContentFilesPath, content)
}
module.exports = init
