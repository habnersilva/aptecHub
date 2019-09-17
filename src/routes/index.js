const init = models => {
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
  const dashboardController = require("../controllers/dashboard")
  const authRoutes = require("./auth")
  const marcasRoutes = require("./marcas")
  const usuariosRoutes = require("./usuarios")

  router.get("/", dashboardController.index)
  router.use("/login", authRoutes(models))
  router.use("/marcas", marcasRoutes(models))
  router.use("/usuarios", usuariosRoutes(models))

  return router
}

module.exports = init
