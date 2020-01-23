const state = require("./state");
const slugify = require("slugify");
const moment = require("moment");

/**
 *
 * @param {*} content
 */
function _filterImageLinkUnique(content) {
  content.original.products = content.original.source.reduce((acc, curr) => {

    let index = 0

    // Encontra o indice do array
    if (curr.size) {
      index = acc.findIndex(
        j =>
        j.item_group_id === curr.item_group_id &&
        j.image_link === curr.image_link &&
        j.size !== curr.size
      )
    } else {
      index = acc.findIndex(
        j =>
        j.item_group_id === curr.item_group_id &&
        j.image_link === curr.image_link
      )
    }

    index = index < 0 ? acc.length : 0

    acc[index] = curr;

    return acc;
  }, []);
}

// function _traeatProduts(content) {
//   content.original.products = content.original.source.reduce((acc, curr) => {

//       if (curr.size) {

//         let index = acc.findIndex(j => j.item_group_id === curr.item_group_id && j.size !== curr.size)

//         if (index < 0)
//           index = acc.length

//         acc[index] = curr

//       } else {

//         let index = acc.findIndex(j => j.item_group_id === curr.item_group_id && j.image_link === curr.image_link)
//         if (index < 0)
//           index = acc.length

//         acc[index] = curr
//       }

//       // console.log('add')
//       // acc.forEach((i, index) => console.log(index, i.id, i.item_group_id))
//       // console.log('-----------')

//       return acc
//     },
//     [])

// }

const init = async objContentFilesPath => {
  //console.log("---> addCustomDataInProducts")

  const content = state.load(objContentFilesPath);

  _filterImageLinkUnique(content);

  state.save(objContentFilesPath, content);
};
module.exports = init;