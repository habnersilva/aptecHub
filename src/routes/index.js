const init = models => {
  const router = require("express").Router()

  const dashboardController = require("../controllers/dashboard")

  router.get("/", dashboardController.index)

  const authRoutes = require("./auth")
  const marcasRoutes = require("./marcas")

  router.use("/login", authRoutes(models))
  router.use("/marcas", marcasRoutes(models))

  return router
}

module.exports = init
