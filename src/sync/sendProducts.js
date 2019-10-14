const portalDoTricot = require("../api/portaldotricot")
const state = require("./state")
const dateFormat = require("dateformat")

async function sync(content) {
  const promises = content.products.products.map(async (product, index) => {
    let productSync = {}

    if (product.sync.status === "create") {
      productSync = await portalDoTricot.create_a_product(product)
    } else if (product.sync.status === "update") {
      productSync = await portalDoTricot.update_a_product(
        product.sync.id,
        product
      )
    }

    if (product.sync.status === "create" || product.sync.status === "update") {
      content.products.products[index].sync = {
        status: "synced",
        date: dateFormat(new Date(), "dd-mm-yyyy HH:MM:ss"),
        id: productSync.id
      }
    }
  })

  await Promise.all(promises)
}

const init = async objContentFilesPath => {
  console.log("=> sendProducts")

  const content = state.load(objContentFilesPath)

  await sync(content)

  state.save(objContentFilesPath, content)
}
module.exports = init
