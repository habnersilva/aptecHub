const index = async ({ Marcas }, req, res) => {
  const marcas = await Marcas.findAll()

  res.render("marcas/index", {
    marcas
  })
}

const create = (req, res) => {
  res.render("marcas/create_form", {
    title: "Nova a Marca"
  })
}

const createProcess = async ({ Marcas }, req, res) => {
  await Marcas.create(req.body)
  res.redirect("/marcas")
}

const edit = async ({ Marcas }, req, res) => {
  const marca = await Marcas.findByPk(req.params.id)
  res.render("marcas/edit_form", {
    title: "Editando a Marca",
    marca
  })
}

const editProcess = async ({ Marcas }, req, res) => {
  await Marcas.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  res.redirect("/marcas")
}

const remove = async ({ Marcas }, req, res) => {
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
  createProcess,
  edit,
  editProcess,
  remove
}
