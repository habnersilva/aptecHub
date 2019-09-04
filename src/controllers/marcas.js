const index = ({ Marcas }) => async (req, res) => {
  const marcas = await Marcas.findAll()

  res.render("marcas/index", {
    marcas
  })
}

const create = ({ Marcas }) => async (req, res) => {
  if (req.method === "GET") {
    res.render("marcas/create_form", {
      title: "Nova a Marca",
      form: {},
      errors: []
    })
  } else {
    try {
      await Marcas.create(req.body)
      res.redirect("/marcas")
    } catch (err) {
      console.error(err)
      res.render("marcas/create_form", {
        title: "Nova a Marca",
        form: req.body,
        errors: err.errors.fields
      })
    }
  }
}

// const createProcess = ({ Marcas }) => async (req, res) => {
//   await Marcas.create(req.body)
//   res.redirect("/marcas")
// }

const edit = ({ Marcas }) => async (req, res) => {
  const marca = await Marcas.findByPk(req.params.id)
  res.render("marcas/edit_form", {
    title: "Editando a Marca",
    marca
  })
}

const editProcess = ({ Marcas }) => async (req, res) => {
  await Marcas.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  res.redirect("/marcas")
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
  //createProcess,
  edit,
  editProcess,
  remove
}
