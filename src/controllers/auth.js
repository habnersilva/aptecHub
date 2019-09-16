const { extractErrors } = require("../utils/formattedErrors")

const login = ({ Usuarios }) => async (req, res) => {
  const { email, passwd } = req.body

  if (req.method === "GET") {
    res.render("auth/index", {
      form: {},
      errors: extractErrors()
    })
  } else {
    try {
      const user = await Usuarios.authenticate(email, passwd)
      req.session.user = user
      res.redirect("/")
    } catch (err) {
      res.render("auth/index", {
        form: req.body,
        errors: extractErrors(err)
      })
    }
  }
}

const logout = (req, res) => {
  req.session.destroy(() => {})
  res.redirect("/login")
}

const register = ({ Usuarios }) => async (req, res) => {
  if (req.method === "GET") {
    res.render("auth/register", {
      form: {},
      errors: extractErrors()
    })
  } else {
    try {
      const usuario = await Usuarios.create(req.body)
      req.flash(
        "success",
        `<b>${usuario.name}<b>, sua conta está em aprovação! Em breve estraremos em contato!`
      )
      res.redirect("/login/cadastrese")
    } catch (err) {
      res.render("auth/register", {
        form: req.body,
        errors: extractErrors(err)
      })
    }
  }
}

module.exports = {
  login,
  logout,
  register
}
