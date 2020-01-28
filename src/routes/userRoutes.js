const init = models => {
  const router = require("express").Router()
  const userController = require("../controllers/userController")

  router.get("/", userController.index(models))
  router.get("/editar/:id", userController.update(models))
  router.post("/editar/:id", userController.update(models))
  router.get("/excluir/:id", userController.remove(models))

  router.get("/meusdados/:id", userController.update(models))
  router.post("/meusdados/:id", userController.update(models))

  return router
}

module.exports = init
