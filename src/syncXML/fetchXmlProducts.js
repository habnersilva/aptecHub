const axios = require("axios")
const xml = require("fast-xml-parser")
const state = require("./state")
const { StringDecoder } = require("string_decoder")

function _decoderBufferUTF8(data_binary) {
  const decoder = new StringDecoder("utf8")
  return decoder.write(Buffer.from(data_binary))
}

/**
 *
 * @param {*} content
 */
async function _getProducts(content) {
  // A request foi respondida em buffer pois estavamos com errors de caracteres
  const response = await axios.request({
    method: "GET",
    url: content.original.brand.linkGoogleShopping,
    responseType: "arraybuffer",
    responseEncoding: "binary"
  })

  const data = _decoderBufferUTF8(response.data.toString("binary"))

  const jsonObj = xml.parse(data)

  if (jsonObj.rss.channel.item.length >= 1) {
    content.original.products = jsonObj.rss.channel.item
  } else {
    content.original.products = [jsonObj.rss.channel.item]
  }
}

/**
 *
 * @param {*} content
 */
function _removeCDATAEmptyInValues(content) {
  content.original.products = content.original.products.map(product => {
    const data = {}
    // Percorre as propriedades do Obj Produtos
    Object.keys(product).forEach(key => {
      if (product[key].hasOwnProperty("cdata")) {
        data[key] = ""
      } else {
        data[key] = product[key]
      }
    })
    return data
  })
}

/**
 *
 * @param {*} content
 */
function _removePrefixGoogleInProps(content) {
  content.original.products = content.original.products.map(product => {
    const data = {}
    // Percorre as propriedades do Obj Produtos, para remover o "g:"
    Object.keys(product).forEach(key => {
      data[key.replace("g:", "")] = product[key]
    })
    return data
  })
}

/**
 *
 * @param {*} content
 */
function salveInTempProducts(content) {
  content.original.products = content.original.productsPattern
}

const init = async objContentFilesPath => {
  console.log("=> fetchXMLProducts")

  const content = state.load(objContentFilesPath)

  await _getProducts(content)
  _removePrefixGoogleInProps(content)
  _removeCDATAEmptyInValues(content)

  state.save(objContentFilesPath, content)
}
module.exports = init
