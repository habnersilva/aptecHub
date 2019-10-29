const portalDoTricot = require("../api/portaldotricot")
const state = require("./state")
const dateFormat = require("dateformat")

// async function sync(content) {
//   const promises = content.production.products.map(async (product, index) => {
//     let productSync = {}

//     if (product.sync.status === "create") {
//       productSync = await portalDoTricot
//         .create_a_product(product)
//         .catch(err => {
//           throw new Error(
//             `Criando produto no PortaldoTricot\n     JSON ${JSON.stringify(
//               product
//             )}\n |--> ${err}`
//           )
//         })
//     } else if (product.sync.status === "update") {
//       console.log("**** update")
//       productSync = await portalDoTricot
//         .update_a_product(product.sync.id, product)
//         .catch(err => {
//           throw new Error(
//             `Editando produto no PortaldoTricot\n     JSON ${JSON.stringify(
//               product
//             )}\n |--> ${err}`
//           )
//         })
//     }

//     if (product.sync.status === "create" || product.sync.status === "update") {
//       content.production.products[index].sync = {
//         status: "synced",
//         date: dateFormat(new Date(), "dd-mm-yyyy HH:MM:ss"),
//         id: productSync.metafields.idaptechub.value,
//         metafields: { ...productSync.metafields }
//       }
//     }
//   })

//   await Promise.all(promises).catch(err => {
//     throw new Error(`Falha no Robot Send Products\n |--> ${err}`)
//   })
// }

/**
 * @param {Object} content
 * @return {Object} product
 */
async function _create(product) {
  return await portalDoTricot.create_a_product(product).catch(err => {
    throw new Error(`Criando produto no PortaldoTricot\n |--> ${err}`)
  })
}

/**
 * @param {number} idportaldotricot
 * @return {Object} product
 */
async function _update(product, idportaldotricot) {
  return await portalDoTricot
    .update_a_product(product, idportaldotricot)
    .catch(err => {
      throw new Error(
        `Editando produto ${product.id} - ${idportaldotricot} no PortaldoTricot\n |--> ${err}`
      )
    })
}

/**
 * @param {number} idportaldotricot
 * @return {Object} product
 */
async function _delete(idportaldotricot) {
  return await portalDoTricot.delete_a_product(idportaldotricot).catch(err => {
    throw new Error(
      `Excluindo produto ${idportaldotricot} no PortaldoTricot\n |--> ${err}`
    )
  })
}

function _getObjectProductSync(productSync, idProduct, status) {
  return {
    status,
    idaptechub: idProduct,
    idportaldotricot: productSync.id,
    date: dateFormat(new Date(), "dd-mm-yyyy HH:MM:ss"),
    metafields: { ...productSync.metafields }
  }
}

/**
 * @param {*} content
 *
 */
async function sync(content) {
  const promises = content.production.products.map(async product => {
    try {
      let productSync = null

      if (product.stage === "new") {
        productSync = await _create(product)
        product.sync = _getObjectProductSync(productSync, product.id, "created")
      } else if (product.stage === "modified") {
        productSync = await _update(product, product.sync.idportaldotricot)
        product.sync = _getObjectProductSync(productSync, product.id, "updated")
      } else if (
        product.stage === "deleted" &&
        product.sync.status !== "deleted"
      ) {
        productSync = await _delete(product.sync.idportaldotricot)
        product.sync = _getObjectProductSync(productSync, product.id, "deleted")
      }

      return product
    } catch (err) {
      console.error(err)
    }
  })

  await Promise.all(promises).catch(err => {
    throw new Error(`Falha no Robot Send Products\n |--> ${err}`)
  })
}

const init = async objContentFilesPath => {
  console.log("=> sendProducts")

  const content = state.load(objContentFilesPath)

  await sync(content)

  state.save(objContentFilesPath, content)
}
module.exports = init
