const init = models => {
  const router = require("express").Router()

  const dashboardController = require("../controllers/dashboard")

  router.get("/", dashboardController.index)

  const authRoutes = require("./auth")
  const marcasRoutes = require("./marcas")
  const usuariosRoutes = require("./usuarios")

  router.use("/login", authRoutes(models))
  router.use("/marcas", marcasRoutes(models))
  router.use("/usuarios", usuariosRoutes(models))

  return router
}

module.exports = init
