const index = ({ Marcas }) => async (req, res) => {
  console.log("marcas index controller", Marcas)
  const marcas = await Marcas.findAll()

  res.render("marcas/index", {
    marcas
  })
}

const create = () => (req, res) => {
  res.render("marcas/create_form", {
    title: "Nova a Marca"
  })
}

const createProcess = ({ Marcas }) => async (req, res) => {
  await Marcas.create(req.body)
  res.redirect("/marcas")
}

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
  createProcess,
  edit,
  editProcess,
  remove
}
