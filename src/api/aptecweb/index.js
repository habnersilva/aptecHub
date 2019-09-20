const axios = require("axios")
const aptecHubError = require("../../errors")

const init = brand => {
  const headers = {
    "Content-Type": "application/json",
    appKey: brand.appKey
  }

  const requestProducts = async () => {
    try {
      const response = await axios.get(`${brand.domain}/ws/wsprodutos.json`, {
        headers
      })
      return response
    } catch (err) {
      throw new aptecHubError({
        errors: [
          {
            path: "global",
            type: "danger",
            message: `Problemas ao acessar a API para marca ${brand.name}`
          }
        ]
      })
    }
  }

  const getAllProducts = async () => {
    const response = await requestProducts()

    const { pagination } = response.data

    let page = 1
    let data = []
    while (page <= pagination.page_count) {
      const response = await axios.get(
        `${brand.domain}/ws/wsprodutos.json?page=${page}`,
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
