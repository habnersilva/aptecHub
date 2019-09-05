const { extractErrors } = require("../utils/validations")

const login = ({ Usuarios }) => async (req, res) => {
  const { email, passwd } = req.body

  if (req.method === "GET") {
    res.render("auth/index", {
      form: {},
      validate: extractErrors()
    })
  } else {
    try {
      const user = await Usuarios.authenticate(email, passwd)
      req.session.user = user
      res.redirect("/")
    } catch (err) {
      console.log(err, extractErrors(err))
      res.render("auth/index", {
        form: req.body,
        validate: extractErrors(err)
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
