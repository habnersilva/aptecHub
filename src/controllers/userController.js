const { extractErrors } = require("../utils/formattedErrors")

const index = ({ Users }) => async (req, res) => {
  const users = await Users.findAll()

  res.render("users/index", {
    users
  })
}

const update = ({ Users }) => async (req, res) => {
  const { id } = req.params
  let attributes = ["id", "name", "email", "passwd", "role"]
  let action = "/usuarios" + req.path

  if (req.path.indexOf("/meusdados") < 0) {
    attributes = attributes.filter(value => value !== "passwd")
  }

  try {
    // Valida se usuario é ele mesmo ou possui perfil administrador
    Users.permissionAccessMyData(req)
  } catch (err) {
    req.flash(err.errors[0].type, err.errors[0].message)
    return res.redirect("back")
  }

  if (req.method === "GET") {
    const user = await Users.findOne({
      where: {
        id
      },
      attributes
    })

    res.render("users/edit_form", {
      id,
      form: user,
      errors: extractErrors(),
      action
    })
  } else {
    try {
      await Users.update(req.body, {
        where: {
          id
        },
        individualHooks: true
      })
      req.flash(
        "success",
        `O usuário ${req.body.name} foi editada com sucesso!`
      )
      res.redirect("/usuarios")
    } catch (err) {
      res.render("users/edit_form", {
        id,
        form: req.body,
        errors: extractErrors(err),
        action
      })
    }
  }
}

const remove = ({ Users }) => async (req, res) => {
  const user = await Users.findByPk(req.params.id)

  Users.destroy({
    where: {
      id: req.params.id
    }
  })

  req.flash("success", `A usuario ${user.name} foi excluída!`)

  res.redirect("/usuarios")
}

module.exports = {
  index,
  update,
  remove
}
