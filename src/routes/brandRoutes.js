const init = models => {
  const router = require("express").Router()
  const brandController = require("../controllers/brandController")

  router.get("/", brandController.index(models))
  router.get("/adicionar", brandController.create(models))
  router.post("/adicionar", brandController.create(models))
  router.get("/editar/:id", brandController.update(models))
  router.post("/editar/:id", brandController.update(models))
  router.get("/excluir/:id", brandController.remove(models))

  router.get("/importar/:id", brandController.importProducts(models))
  router.get("/enviar/:id", brandController.sendProducts(models))

  return router
}

module.exports = init
