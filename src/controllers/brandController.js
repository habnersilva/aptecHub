const { extractErrors } = require("../utils/formattedErrors")
const aptecWeb = require("../api/aptecweb")
const sync = require("../sync")
const cron = require("node-cron")
const moment = require("moment")

const index = ({ Brands, Syncs }) => async (req, res) => {
  const brands = await Brands.findAll({
    include: [{ model: Syncs }]
  })

  brands.map(brand => (brand.sync = sync(brand).load()))

  res.render("brands/index", {
    brands
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

const syncProducts = ({ Brands, Syncs }) => async (req, res) => {
  const brand = await Brands.findByPk(req.params.id)

  try {
    sync(brand).start()
    req.flash("success", `Importação realizar com sucesso para ${brand.name}`)
    res.redirect("/marcas")
  } catch (err) {
    console.log(err)
    if (err.name === "AptecHubError")
      req.flash(err.errors[0].type, err.errors[0].message)

    res.redirect("/marcas")
  }
}

const syncAuto = ({ tasks }) => async (req, res) => {
  if (req.params.option === "on") {
    console.log("start autoSync!")
    tasks.autoSync.start()
  } else {
    console.log("stop!")
    tasks.autoSync.stop()
  }

  res.redirect("/marcas")
}

const syncAllBrands = ({ Brands }) => async (req, res) => {
  try {
    const brands = await Brands.findAll()

    await Promise.all(
      brands.map(async brand => {
        await sync(brand).start()
      })
    )
    req.flash("success", `Sincronização realizada`)
    res.redirect("/marcas")
  } catch (err) {
    console.error(err)
  }
}

const resetSyncProducts = ({ Brands, Syncs }) => async (req, res) => {
  const brand = await Brands.findByPk(req.params.id)

  try {
    await sync(brand).reset()

    req.flash(
      "success",
      `Reinicialização realizar com sucesso para ${brand.name}`
    )
    res.redirect("/marcas")
  } catch (err) {
    console.log(err)
    if (err.name === "AptecHubError")
      req.flash(err.errors[0].type, err.errors[0].message)

    res.redirect("/marcas")
  }
}

module.exports = {
  index,
  create,
  update,
  remove,
  syncAuto,
  syncAllBrands,
  syncProducts,
  resetSyncProducts
}
