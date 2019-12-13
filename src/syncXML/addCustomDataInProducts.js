const state = require("./state")

function _set_gender(product, brand) {
  let gender = ""

  if (product.hasOwnProperty("gender")) {
    gender = product.gender
  } else {
    gender = ""
  }

  return brand.fidexGender ? brand.fidexGender : gender
}

function _set_age_group(product, brand) {
  let age_group = ""

  if (product.hasOwnProperty("gender")) {
    age_group = product.age_group
  } else {
    age_group = ""
  }

  // Caso Genero seja fixo no cadastra da Marca e será automaticamente "adult"
  return brand.fidexGender ? "adult" : age_group
}

const init = async objContentFilesPath => {
  console.log("=> addCustomDataInProducts")

  const content = state.load(objContentFilesPath)

  content.production.products = content.production.products.map(product => {
    product.domain = content.production.brand.domain
    product.brand = content.production.brand.name
    product.age_group = _set_age_group(product, content.production.brand)
    product.gender = _set_gender(product, content.production.brand)

    return product
  })

  state.save(objContentFilesPath, content)
}
module.exports = init
