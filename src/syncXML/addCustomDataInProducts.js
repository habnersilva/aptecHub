const state = require("./state")
const slugify = require("slugify")

/**
 *
 * @param {*} product
 * @param {*} brand
 */
function _set_gender(product, brand) {
  let gender = ""

  if (product.hasOwnProperty("gender")) {
    gender = product.gender
  } else {
    gender = ""
  }

  return (brand.fidexGender ? brand.fidexGender : gender).toLowerCase()
}

/**
 *
 * @param {*} product
 * @param {*} brand
 */
function _set_age_group(product, brand) {
  let age_group = ""

  if (product.hasOwnProperty("gender")) {
    age_group = product.age_group
  } else {
    age_group = ""
  }

  // Caso Genero seja fixo no cadastra da Marca e será automaticamente "adult"
  return (brand.fidexGender ? "adult" : age_group).toLowerCase()
}

/**
 *
 * @param {*} link
 * @obs Pego o final do atributo link para criar o slud no produto
 */
function _getSlug(link, suffix) {
  if (!link) return ""

  const split = link.split("/")
  const length = split.length
  let slug = split[length - 1]

  slug = slug === "p" ? split[length - 2] : slug

  return slugify(`${slug}-${suffix}`, {
    replacement: "-",
    lower: true
  })
}

const init = async objContentFilesPath => {
  console.log("=> addCustomDataInProducts")

  const content = state.load(objContentFilesPath)

  content.original.products = content.original.source.map(product => {
    const gender = _set_gender(product, content.production.brand)
    const age_group = _set_age_group(product, content.production.brand)
    const size = product.size.toUpperCase()
    const color = product.color.toLowerCase()

    // Forço o nome da Marca com dados cadastrado no AptecHub
    product.brand = content.production.brand.name
    product.domain = content.production.brand.domain
    product.published = true
    product.size = size
    product.color = color

    // Alugns XML não possuem o campo age_group, assim seto o valor do atributo no cadastro da Marca
    product.age_group = age_group
    product.gender = gender
    // Shopify exige o slug(handle)
    product.slug = _getSlug(product.link, `${product.id}-${product.brand}`)
    product.tags = `${gender}, ${age_group}, ${size}, ${color} `

    return product
  })

  state.save(objContentFilesPath, content)
}
module.exports = init
