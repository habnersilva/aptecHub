const Shopify = require("shopify-api-node")

const init = () => {
  const shopify = new Shopify({
    shopName: process.env.SHOPIFY_SHOPNAME,
    apiKey: process.env.SHOPIFY_APIKEY,
    password: process.env.SHOPIFY_PASSWORD,
    apiVersion: "2019-07",
    autoLimit: {
      calls: 1,
      interval: 2000,
      bucketSize: 35
    }
  })

  //shopify.on("callLimits", limits => console.log(limits))

  /**
   *
   * @param {*} data
   * @param {*} idProductShopify
   */
  const _getObjMetaFields = (data, idProductShopify) => {
    return {
      link: {
        key: "link",
        value: data.link,
        value_type: "string",
        namespace: "aptecHub",
        owner_resource: "product",
        owner_id: idProductShopify
      },
      idaptechub: {
        key: "idaptechub",
        value: data.id,
        value_type: "string",
        namespace: "aptecHub",
        owner_resource: "product",
        owner_id: idProductShopify
      }
    }
  }

  /**
   *
   * @param {*} data
   */
  const _transformDataFromShopify = data => {
    const params = {
      title: data.title,
      handle: data.slug,
      body_html: data.description,
      vendor: data.brand,
      domain: data.domain,
      product_type: data.product_type,
      published_at: data.published_at,
      tags: data.tags,
      variants: [
        {
          price: data.price,
          inventory_quantity: 1
        }
      ],
      images: [
        {
          src: data.image_link
        }
      ]
    }

    return params
  }

  /**
   * @param {*} data
   * @return {Promise}
   */
  const create_a_product = async data => {
    return new Promise(async (resolve, reject) => {
      try {
        const params = _transformDataFromShopify(data)

        // adiciona produto
        let productShopify = await shopify.product.create(params).catch(err => {
          const error = `\n==> Criando produto no Shopify\n |--> ${JSON.stringify(
            err.response.body.errors
          )}`
          throw new Error(error)
        })

        const objMetaFields = _getObjMetaFields(data, productShopify.id)

        // adiciona metafields
        productShopify.metafields = {
          // adiciona metafield "link"
          link: await shopify.metafield
            .create(objMetaFields.link)
            .catch(err => {
              const error = `==> Criando metafield "link" no Shopify\n |--> ${JSON.stringify(
                err.response.body.errors
              )}`
              throw new Error(error)
            }),
          // adiciona metafield "idaptechub"
          idaptechub: await shopify.metafield
            .create(objMetaFields.idaptechub)
            .catch(err => {
              const error = `==> Criando metafield "idaptechub" no Shopify\n |--> ${JSON.stringify(
                err.response.body.errors
              )}`
              throw new Error(error)
            })
        }

        resolve(productShopify)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * @param {*} data
   * @param {*} idProductShopify
   * @return {Promise}
   */
  const update_a_product = async (data, idProductShopify) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!idProductShopify) {
          throw new Error(`Não existe id do shopify para o produto: ${data.id}`)
        }

        const params = _transformDataFromShopify(data)

        // edita produto
        let productShopify = await shopify.product
          .update(idProductShopify, params)
          .catch(err => {
            const error = `\n==> Editando produto no Shopify\n |--> ${JSON.stringify(
              err.response.body.errors
            )}`
            throw new Error(error)
          })

        // Edita metafields
        productShopify.metafields = {
          // Edita metafield "link"
          link: await shopify.metafield
            .update(data.sync.metafields.link.id, {
              value: data.link
            })
            .catch(err => {
              const error = `==> Editando metafield "link" no Shopify\n |--> ${JSON.stringify(
                err.response.body.errors
              )}`
              throw new Error(error)
            }),
          // Edita metafield "idaptechub"
          idaptechub: await shopify.metafield
            .update(data.sync.metafields.idaptechub.id, {
              value: data.id
            })
            .catch(err => {
              const error = `==> Editando metafield "idaptechub" no Shopify\n |--> ${JSON.stringify(
                err.response.body.errors
              )}`
              throw new Error(error)
            })
        }

        resolve(productShopify)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * @param {*} data
   * @param {*} idProductShopify
   * @return {Promise}
   */
  const delete_a_product = async idProductShopify => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!idProductShopify) {
          throw new Error(`Não existe id do shopify para o produto`)
        }

        // delete produto
        await shopify.product.delete(idProductShopify).catch(err => {
          const error = `\n==> Excluindo produto no Shopify\n |--> ${JSON.stringify(
            err.response.body.errors
          )}`
          throw new Error(error)
        })

        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   *
   * @param {*} params
   */
  const list_all_products = async params => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        let products = []
        params.limit = 10

        do {
          let productsSyncs = await shopify.product.list(params)

          params = productsSyncs.nextPageParameters

          productsSyncs = await Promise.all(
            productsSyncs.map(async product => {
              const metafields = await shopify.metafield.list({
                metafield: {
                  owner_resource: "product",
                  owner_id: product.id
                }
              })
              return {
                ...product,
                metafields
              }
            })
          )

          products = [...products, ...productsSyncs]
        } while (params !== undefined)
        resolve(products)
      } catch (err) {
        reject(err)
      }
    })

    return promise
  }

  /**
   *
   * @param {*} params
   */
  const count_all_products = async params => {
    return await shopify.product.count(params)
  }

  return {
    create_a_product,
    update_a_product,
    delete_a_product,
    list_all_products,
    count_all_products
  }
}

module.exports = init()
