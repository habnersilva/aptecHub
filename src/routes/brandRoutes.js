const init = models => {
  const router = require("express").Router()
  const brandController = require("../controllers/brandController")

  router.get("/", brandController.index(models))
  router.get("/adicionar", brandController.create(models))
  router.post("/adicionar", brandController.create(models))
  router.get("/editar/:id", brandController.update(models))
  router.post("/editar/:id", brandController.update(models))
  router.get("/excluir/:id", brandController.remove(models))

  router.get("/sincronizar/todos", brandController.syncAllBrands(models))

  router.get("/sincronizar/:id", brandController.syncProducts(models))
  router.get("/reiniciar/:id", brandController.resetSyncProducts(models))

  return router
}

module.exports = init
