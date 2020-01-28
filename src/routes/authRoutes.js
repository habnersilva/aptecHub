const init = models => {
  const router = require("express").Router()
  const authController = require("../controllers/authController")

  router.get("/", authController.login(models))
  router.post("/", authController.login(models))
  router.get("/cadastrese", authController.register(models))
  router.post("/cadastrese", authController.register(models))
  router.get("/sair", authController.logout)

  return router
}

module.exports = init
