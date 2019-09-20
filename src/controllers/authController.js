const { extractErrors } = require("../utils/formattedErrors")

const login = ({ Users }) => async (req, res) => {
  const { email, passwd } = req.body

  if (req.method === "GET") {
    res.render("auth/index", {
      form: {},
      errors: extractErrors()
    })
  } else {
    try {
      const user = await Users.authenticate(email, passwd)
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

const register = ({ Users }) => async (req, res) => {
  if (req.method === "GET") {
    res.render("auth/register", {
      form: {},
      errors: extractErrors()
    })
  } else {
    try {
      const usuario = await Users.create(req.body)
      req.flash(
        "success",
        `${usuario.name}, sua conta está em aprovação! Em breve estraremos em contato!`
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
