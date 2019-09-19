const axios = require("axios")

const init = Marca => {
  const headers = {
    "Content-Type": "application/json",
    appKey: Marca.appKey
  }

  const getAllProducts = async () => {
    const response = await axios.get(`${Marca.domain}/ws/wsprodutos.json`, {
      headers
    })

    const { pagination } = response.data

    let page = 1
    let data = []
    while (page <= 1) {
      //while (page <= pagination.page_count) {
      const response = await axios.get(
        `${Marca.domain}/ws/wsprodutos.json?page=${page}`,
        {
          headers
        }
      )

      data = data.concat(response.data.result)
      page++
    }

    return data
  }

  const products = {}

  products.getAll = () => {
    return getAllProducts()
  }

  return {
    products
  }
}

module.exports = init
