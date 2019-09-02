const index = (req, res) => {
  res.render("marcas/index")
}

const create = (req, res) => {
  res.render("marcas/edit_form", {
    title: "Nova a Marca"
  })
}

const edit = (req, res) => {
  res.render("marcas/edit_form", {
    title: "Editando a Marca"
  })
}

const remove = (req, res) => {
  res.redirect("marcas")
}

module.exports = {
  index,
  create,
  edit,
  remove
}
