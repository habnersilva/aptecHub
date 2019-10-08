const state = require("./state")

const init = (brand, contentFilePath) => {
  console.log("=> initFileContent")

  const content = state.load(contentFilePath)

  const { id, name, domain, appKey } = brand
  content.brand = { id, name, domain, appKey }
//   content.aptecweb = {
//     dataOriginal: [],
//     dataTreated: []
//   }
//   content.portaldotricot = {
//     dataOriginal: [],
//     dataTreated: []
//   }
//   content.products = []
//   content.updates = []
//   content.syncs = []

  state.save(contentFilePath, content)
}

module.exports = init
