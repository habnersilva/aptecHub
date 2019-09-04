const init = models => {
  const router = require("express").Router()
  const authController = require("../controllers/auth")

  router.get("/", authController.index)
  router.post("/", authController.login(models))
  router.get("/sair", authController.logout)

  return router
}

module.exports = init
