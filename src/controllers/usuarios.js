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
      res.render("usuarios/create_form", {
        form: req.body,
        errors: extractErrors(err)
      })
    }
  }
}

const update = ({ Usuarios }) => async (req, res) => {
  const { id } = req.params
  let attributes = ["id", "name", "email", "passwd", "role"]
  let action = "/usuarios" + req.path

  if (req.path.indexOf("/meusdados") < 0) {
    attributes = attributes.filter(value => value !== "passwd")
  }

  try {
    // Valida se usuario é ele mesmo ou possui perfil administrador
    Usuarios.permissionAccessMyData(req)
  } catch (err) {
    req.flash(err.errors[0].type, err.errors[0].message)
    return res.redirect("back")
  }

  if (req.method === "GET") {
    const usuario = await Usuarios.findOne({
      where: {
        id
      },
      attributes
    })

    res.render("usuarios/edit_form", {
      id,
      form: usuario,
      errors: extractErrors(),
      action
    })
  } else {
    try {
      await Usuarios.update(req.body, {
        where: {
          id
        },
        individualHooks: true
      })
      req.flash(
        "success",
        `A usuario ${req.body.name} foi editada com sucesso!`
      )
      res.redirect("back")
    } catch (err) {
      res.render("usuarios/edit_form", {
        id,
        form: req.body,
        errors: extractErrors(err),
        action
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

  req.flash("into", `A usuario ${usuario.name} foi excluída!`)

  res.redirect("/usuarios")
}

module.exports = {
  index,
  create,
  update,
  remove
}
