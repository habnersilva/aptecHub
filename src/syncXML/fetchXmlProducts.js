const state = require("./state")
const axios = require("axios")
const xml = require("fast-xml-parser")
const { StringDecoder } = require("string_decoder")

/**
 *
 * @param {*} data_binary
 */
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

  // Pega o tipo da variavel
  const typeItem = Object.prototype.toString.call(jsonObj.rss.channel.item)

  if (typeItem === "[object Array]") {
    content.original.source = jsonObj.rss.channel.item
  } else if (typeItem === "[object Object]") {
    content.original.source = [jsonObj.rss.channel.item]
  } else {
    content.original.source = []
  }
}

/**
 *
 * @param {*} content
 */
function _removeCDATAEmptyInValues(content) {
  content.original.source = content.original.source.map(product => {
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
  content.original.source = content.original.source.map(product => {
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
 * @param {*} objContentFilesPath
 */
const init = async objContentFilesPath => {
  console.log("=> fetchXMLProducts")

  const content = state.load(objContentFilesPath)

  await _getProducts(content)
  _removePrefixGoogleInProps(content)
  _removeCDATAEmptyInValues(content)

  state.save(objContentFilesPath, content)
}

module.exports = init
