const state = require("./state")
const axios = require("axios")
const xml = require("fast-xml-parser")
const { StringDecoder } = require("string_decoder")

/**
 *
 * @param {*} arrayBuffer
 * @param {*} platform
 */
function _treatEnconding(arrayBuffer, platform) {
  const decoder = new StringDecoder("utf8")

  let data_binary = null
  if (platform === "icone") {
    data_binary = arrayBuffer.toString("binary")
  } else {
    data_binary = arrayBuffer.toString()
  }
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

  const dataXml = _treatEnconding(
    response.data,
    content.original.brand.platform
  )

  // Transforma XML in JSON
  const jsonObj = xml.parse(dataXml)

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
  // console.log("---> fetchXMLProducts")

  const content = await state.load(objContentFilesPath)

  await _getProducts(content)
  _removePrefixGoogleInProps(content)
  _removeCDATAEmptyInValues(content)

  await state.save(objContentFilesPath, content)
}

module.exports = init
