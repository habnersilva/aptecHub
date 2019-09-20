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
      const brand = await Brands.create(req.body)
      req.flash("success", `A marca ${brand.name} foi criada com sucesso!`)
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
    const brand = await Brands.findByPk(id)

    res.render("brands/edit_form", {
      id,
      form: brand,
      errors: extractErrors()
    })
  } else {
    try {
      const brand = await Brands.update(req.body, {
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
  const brand = await Brands.findByPk(req.params.id)

  Brands.destroy({
    where: {
      id: req.params.id
    }
  })

  req.flash("success", `A marca ${brand.name} foi excluída!`)

  res.redirect("/marcas")
}

const importProducts = ({ Brands, Syncs }) => async (req, res) => {
  const brand = await Brands.findByPk(req.params.id)

  try {
    const products = await aptecWeb(brand).products.getAll()
    const { filePath, totalOfProducts, stats } = await cacheProducts.save(
      brand,
      products
    )

    await Syncs.create({
      type: "import",
      filePath,
      size: stats.size,
      totalOfProducts
    })

    req.flash("success", `Importação realizar com sucesso para ${brand.name}`)
    res.redirect("/marcas")
  } catch (err) {
    console.error(err)
    if (err.name === "AptecHubError")
      req.flash(err.errors[0].type, err.errors[0].message)

    res.redirect("/marcas")
  }
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
