const init = dependencies => {
  const router = require("express").Router()
  const acl = require("express-acl")

  // ACL
  acl.config({
    path: "src/config",
    filename: "acl.json",
    baseUrl: "/",
    roleSearchPath: "session.user.role",
    denyCallback: (req, res) => {
      const msg = req.query.action ? `"${req.query.action}"` : `"${req.path}"`

      req.flash(
        "warning",
        `${res.locals.user.name}, você não possui permissão para acessar ${msg}!`
      )

      return res.redirect("back")
    }
  })

  const arrayOfPermission = ["/login", "/login/sair", "/login/cadastrese"]

  router.use(
    acl.authorize.unless({
      path: arrayOfPermission
    })
  )

  // Routers
  const dashboardController = require("../controllers/dashboardController")
  const authRoutes = require("./authRoutes")
  const marcasRoutes = require("./brandRoutes")
  const usuariosRoutes = require("./userRoutes")

  router.get("/", dashboardController.index)
  router.use("/login", authRoutes(dependencies.models))
  router.use("/marcas", marcasRoutes(dependencies))
  router.use("/usuarios", usuariosRoutes(dependencies.models))

  return router
}

module.exports = init
