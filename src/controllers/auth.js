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

module.exports = {
  login,
  logout
}
