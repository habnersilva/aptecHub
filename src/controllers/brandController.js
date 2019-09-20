const { extractErrors } = require("../utils/formattedErrors")
const aptecWeb = require("../api/aptecweb")
const cacheProducts = require("../utils/cacheProducts")

const index = ({ Brands }) => async (req, res) => {
  let sync = {}
  const brands = await Brands.findAll()

  res.render("brands/index", {
    brands,
    products: {}
  })
}

const create = ({ Brands }) => async (req, res) => {
  if (req.method === "GET") {
    res.render("brands/create_form", {
      form: {},
      errors: extractErrors()
    })
  } else {
    try {
      const marca = await Brands.create(req.body)
      req.flash("success", `A marca ${marca.name} foi criada com sucesso!`)
      res.redirect("/marcas")
    } catch (err) {
      res.render("brands/create_form", {
        form: req.body,
        errors: extractErrors(err)
      })
    }
  }
}

const update = ({ Brands }) => async (req, res) => {
  const { id } = req.params

  if (req.method === "GET") {
    const marca = await Brands.findByPk(id)

    res.render("brands/edit_form", {
      id,
      form: marca,
      errors: extractErrors()
    })
  } else {
    try {
      const marca = await Brands.update(req.body, {
        where: {
          id
        }
      })
      req.flash("success", `A marca ${req.body.name} foi editada com sucesso!`)
      res.redirect("/marcas")
    } catch (err) {
      res.render("brands/edit_form", {
        id,
        form: req.body,
        errors: extractErrors(err)
      })
    }
  }
}

const remove = ({ Brands }) => async (req, res) => {
  const marca = await Brands.findByPk(req.params.id)

  Brands.destroy({
    where: {
      id: req.params.id
    }
  })

  req.flash("success", `A marca ${marca.name} foi excluída!`)

  res.redirect("/marcas")
}

const importProducts = ({ Brands }) => async (req, res) => {
  const marca = await Brands.findByPk(req.params.id)

  try {
    const produtos = await aptecWeb(marca).products.getAll()
    cacheProducts.save(marca, produtos)
  } catch (err) {
    console.error(err)
  }

  res.send("import")
}

const sendProducts = ({ Brands }) => async (req, res) => {
  res.send("send")
}

module.exports = {
  index,
  create,
  update,
  remove,
  importProducts,
  sendProducts
}
