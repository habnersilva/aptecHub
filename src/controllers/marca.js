const index = (req, res) => {
  res.render("marcas/index")
}

const create = (req, res) => {
  res.render("marcas/edit_form")
}

const edit = (req, res) => {
  res.render("marcas/edit_form")
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
