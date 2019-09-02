const init = models => {
  const router = require("express").Router()

  const dashboardController = require("../controllers/dashboard")
  router.get("/", dashboardController.index)

  const marcasRoutes = require("./marcas")
  console.log("routes", models)
  router.use("/marcas", marcasRoutes(models))

  return router
}

module.exports = init
