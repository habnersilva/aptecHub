const { extractErrors } = require("../utils/formattedErrors")
const syncXML = require("../syncXML")

const index = ({ models, tasks }) => async (req, res) => {
  const brands = await models.Brands.findAll()

  await Promise.all(
    brands.map(async brand => {
      brand.sync = await syncXML(brand).load()
      return brand
    })
  )

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

const sync = ({ Brands }) => async (req, res) => {
  const brand = await Brands.findByPk(req.params.id)

  try {
    await syncXML(brand).sync()
    req.flash("success", `Importação realizar com sucesso para ${brand.name}`)
    res.redirect("/marcas")
  } catch (err) {
    console.error(err)
    if (err.name === "AptecHubError")
      req.flash(err.errors[0].type, err.errors[0].message)

    res.redirect("/marcas")
  }
}

const syncAuto = ({ tasks }) => async (req, res) => {
  if (req.params.option === "on") {
    tasks.autoSync.start()
    tasks.autoDownload.start()
    console.log("start autoSync!")
  } else {
    tasks.autoSync.stop()
    console.log("stop!")
  }

  res.redirect("/marcas")
}

const resetSync = ({ Brands }) => async (req, res) => {
  const brand = await Brands.findByPk(req.params.id)

  try {
    await syncXML(brand).reset()

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

const downloadSync = ({ Brands }) => async (req, res) => {
  const brand = await Brands.findByPk(req.params.id)

  try {
    await syncXML(brand).download()
    req.flash("success", `Download realizado com sucesso para ${brand.name}`)
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
  sync,
  resetSync,
  downloadSync
}
