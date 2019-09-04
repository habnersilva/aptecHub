const index = (req, res) => {
  res.render("auth/index")
}

const login = ({ Usuarios }) => async (req, res) => {
  const { email, passwd } = req.body

  try {
    const user = await Usuarios.authenticate(email, passwd)
    req.session.user = user
    res.redirect("/")
  } catch (err) {
    res.send("Erro => " + err)
  }
}

const logout = (req, res) => {
  req.session.destroy(() => {})
  res.redirect("/login")
}

module.exports = {
  index,
  login,
  logout
}
