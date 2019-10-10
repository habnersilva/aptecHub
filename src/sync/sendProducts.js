const portalDoTricot = require("../api/portaldotricot")
const state = require("./state")
const dateFormat = require("dateformat")

async function sendProductsFromPortaldoTricot(content) {
  const promises = content.products.products.map(async (product, index) => {
    if (product.sync.status === "waiting") {
      const productSync = await portalDoTricot.create_a_product(product)

      content.products.products[index].sync = {
        status: "sync",
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

  await sendProductsFromPortaldoTricot(content)

  state.save(objContentFilesPath, content)
}
module.exports = init
