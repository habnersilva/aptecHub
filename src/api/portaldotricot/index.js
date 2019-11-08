const Shopify = require("shopify-api-node")

const init = () => {
  const shopify = new Shopify({
    shopName: process.env.SHOPIFY_SHOPNAME,
    apiKey: process.env.SHOPIFY_APIKEY,
    password: process.env.SHOPIFY_PASSWORD,
    autoLimit: {
      calls: 1,
      interval: 2000,
      bucketSize: 35
    }
  })

  //shopify.on("callLimits", limits => console.log(limits))

  const _getObjMetaFields = (data, idProductShopify) => {
    return {
      link: {
        key: "link",
        value: data.domain + "/" + data.slug,
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

  const _transformDataFromShopify = data => {
    const params = {
      title: data.title,
      product_type: "Roupa",
      vendor: data.brand,
      domain: data.domain,
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
          throw new Error(
            `${err}\n     ==> Criando produto no Shopify\n |--> ${err}`
          )
        })

        const objMetaFields = _getObjMetaFields(data, productShopify.id)

        // adiciona metafields
        productShopify.metafields = {
          // adiciona metafield "link"
          link: await shopify.metafield
            .create(objMetaFields.link)
            .catch(err => {
              throw new Error(
                `${err}\n     ==> Criando metafield "link" no Shopify\n |--> ${err}`
              )
            }),
          // adiciona metafield "idaptechub"
          idaptechub: await shopify.metafield
            .create(objMetaFields.idaptechub)
            .catch(err => {
              throw new Error(
                `${err}\n     ==> Criando metafield "idaptechub" no Shopify\n |--> ${err}`
              )
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
        const params = _transformDataFromShopify(data)

        // edita produto
        let productShopify = await shopify.product
          .update(idProductShopify, params)
          .catch(err => {
            //console.error(err)
            throw new Error(`Editando produto no Shopify\n |--> ${err}`)
          })

        const objMetaFields = _getObjMetaFields(data, idProductShopify)

        // Edita metafields
        productShopify.metafields = {
          // Edita metafield "link"
          link: await shopify.metafield
            .update(data.sync.metafields.link.id, {
              value: objMetaFields.link.value
            })
            .catch(err => {
              throw new Error(
                `${err}\n     ==> Editando metafield "link" no Shopify\n |--> ${err}`
              )
            }),
          // Edita metafield "idaptechub"
          idaptechub: await shopify.metafield
            .update(data.sync.metafields.idaptechub.id, {
              value: objMetaFields.idaptechub.value
            })
            .catch(err => {
              throw new Error(
                `${err}\n     ==> Editando metafield "idaptechub" no Shopify\n |--> ${err}`
              )
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
        // delete produto
        await shopify.product.delete(idProductShopify).catch(err => {
          throw new Error(`Excluindo produto no Shopify\n |--> ${err}`)
        })

        resolve("deleted")
      } catch (err) {
        reject(err)
      }
    })
  }

  const list_all_products = async params => {
    try {
      let productsSyncs = await shopify.product.list(params)

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

      return productsSyncs
    } catch (err) {
      console.error(err)
    }
  }

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
