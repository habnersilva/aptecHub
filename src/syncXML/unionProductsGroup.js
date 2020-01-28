const state = require("./state");

function _removeDuplicatesStr(str) {
  return [...new Set(str.split(", "))].join(", ");
}

/**
 *
 * @param {*} content
 */
function _filterImageLinkUnique(content) {
  content.original.products = content.original.source.reduce((acc, curr) => {
    let index = 0;
    let strSize = curr.size ? curr.size + ", " : "";

    // Encontra o indice do array
    index = acc.findIndex(
      j =>
        j.item_group_id === curr.item_group_id &&
        j.image_link === curr.image_link
    );

    // Adiciona todos tamanhos do produto em tag
    if (index < 0) {
      index = acc.length;
      curr.tags = strSize;
    } else {
      curr.tags = acc[index].tags.concat(strSize);
      curr.tags = _removeDuplicatesStr(curr.tags);
    }

    acc[index] = curr;

    return acc;
  }, []);
}

const init = async objContentFilesPath => {
  //console.log("---> unionProductsGroup")

  const content = state.load(objContentFilesPath);

  _filterImageLinkUnique(content);

  state.save(objContentFilesPath, content);
};
module.exports = init;
