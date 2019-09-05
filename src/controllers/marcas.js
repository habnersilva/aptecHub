const { extractErrors } = require("../utils/validations")

const index = ({ Marcas }) => async (req, res) => {
  const marcas = await Marcas.findAll()

  res.render("marcas/index", {
    marcas
  })
}

const create = ({ Marcas }) => async (req, res) => {
  if (req.method === "GET") {
    res.render("marcas/create_form", {
      form: {},
      validate: extractErrors()
    })
  } else {
    try {
      await Marcas.create(req.body)
      res.redirect("/marcas")
    } catch (err) {
      res.render("marcas/create_form", {
        form: req.body,
        validate: extractErrors(err)
      })
    }
  }
}

const update = ({ Marcas }) => async (req, res) => {
  const { id } = req.params

  if (req.method === "GET") {
    const marca = await Marcas.findByPk(id)

    res.render("marcas/edit_form", {
      id,
      form: marca,
      validate: extractErrors()
    })
  } else {
    try {
      await Marcas.update(req.body, {
        where: {
          id
        }
      })
      res.redirect("/marcas")
    } catch (err) {
      res.render("marcas/edit_form", {
        id,
        form: req.body,
        validate: extractErrors(err)
      })
    }
  }
}

const remove = ({ Marcas }) => async (req, res) => {
  await Marcas.destroy({
    where: {
      id: req.params.id
    }
  })

  res.redirect("/marcas")
}

module.exports = {
  index,
  create,
  update,
  remove
}
