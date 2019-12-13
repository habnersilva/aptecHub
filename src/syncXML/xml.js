const axios = require("axios")
const xml = require("fast-xml-parser")
const portalDoTricot = require("../api/portaldotricot")

async function _getProducts() {
  const result = await axios.get(
    "https://www.guiadotricot.com.br/file/exportacao/xml-google-.xml"
  )
  const jsonObj = xml.parse(result.data)

  return jsonObj.rss.channel.item
}

const init = async objContentFilesPath => {
  const products = await _getProducts()
}

init()
