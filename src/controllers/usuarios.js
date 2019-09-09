const { extractErrors } = require("../utils/formattedErrors")

const index = ({ Usuarios }) => async (req, res) => {
  const usuarios = await Usuarios.findAll()

  res.render("usuarios/index", {
    usuarios
  })
}

const create = ({ Usuarios }) => async (req, res) => {
  if (req.method === "GET") {
    res.render("usuarios/create_form", {
      form: {},
      errors: extractErrors()
    })
  } else {
    try {
      const usuario = await Usuarios.create(req.body)
      req.flash("success", `A usuario ${usuario.name} foi criada com sucesso!`)
      res.redirect("/usuarios")
    } catch (err) {
      console.log(err)
      res.render("usuarios/create_form", {
        form: req.body,
        errors: extractErrors(err)
      })
    }
  }
}

/*
const update = ({ Usuarios }) => async (req, res) => {
  const { id } = req.params

  if (req.method === "GET") {
    const usuario = await Usuarios.findByPk(id)

    res.render("Usuarios/edit_form", {
      id,
      form: marca,
      errors: extractErrors()
    })
  } else {
    try {
      const usuario = await Usuarios.update(req.body, {
        where: {
          id
        }
      })
      req.flash("success", `A usuario ${req.body.name} foi editada com sucesso!`)
      res.redirect("/Usuarios")
    } catch (err) {
      res.render("Usuarios/edit_form", {
        id,
        form: req.body,
        errors: extractErrors(err)
      })
    }
  }
}

const remove = ({ Usuarios }) => async (req, res) => {
  const usuario = await Usuarios.findByPk(req.params.id)

  Usuarios.destroy({
    where: {
      id: req.params.id
    }
  })

  req.flash("into", `A usuario ${marca.name} foi excluída!`)

  res.redirect("/Usuarios")
}*/

module.exports = {
  index,
  create
  // update,
  // remove
}
