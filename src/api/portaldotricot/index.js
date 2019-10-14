const Shopify = require("shopify-api-node")

const init = () => {
  const shopify = new Shopify({
    shopName: process.env.SHOPIFY_SHOPNAME,
    apiKey: process.env.SHOPIFY_APIKEY,
    password: process.env.SHOPIFY_PASSWORD
  })

  const transformDataFromShopify = data => {
    const params = {
      title: data.title,
      product_type: "Roupa",
      vendor: data.brand,
      variants: [
        {
          price: data.price
        }
      ],
      images: [
        {
          src: data.imageMain,
          position: 1,
          width: "828",
          height: "1200"
        }
      ]
    }

    return params
  }

  const create_a_product = async data => {
    return new Promise(async (resolve, reject) => {
      try {
        params = transformDataFromShopify(data)
        const shopify_product = await shopify.product.create(params)

        shopify.metafield.create({
          key: "link",
          value: data.domain + data.slug,
          value_type: "string",
          namespace: "aptecHub",
          owner_resource: "product",
          owner_id: shopify_product.id
        })

        shopify.metafield.create({
          key: "idaptechub",
          value: data.id,
          value_type: "string",
          namespace: "aptecHub",
          owner_resource: "product",
          owner_id: shopify_product.id
        })

        resolve(shopify_product)
      } catch (err) {
        console.log(err.statusCode)
        reject(err)
      }
    })
  }

  const update_a_product = async (id, data) => {
    try {
      params = transformDataFromShopify(data)
      const shopify_product = await shopify.product.update(id, params)

      shopify.metafield.update({
        key: "link",
        value: data.domain + data.slug,
        value_type: "string",
        namespace: "aptecHub",
        owner_resource: "product",
        owner_id: shopify_product.id
      })

      shopify.metafield.update({
        key: "idaptechub",
        value: data.id,
        value_type: "string",
        namespace: "aptecHub",
        owner_resource: "product",
        owner_id: shopify_product.id
      })

      return shopify_product
    } catch (err) {
      console.log(err.statusCode)
    }
  }

  const list_all_products = async () => await shopify.product.list()

  return {
    create_a_product,
    update_a_product,
    list_all_products
  }
}

module.exports = init()
