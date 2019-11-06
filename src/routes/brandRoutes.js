const init = dependencies => {
  const router = require("express").Router()
  const brandController = require("../controllers/brandController")

  router.get("/", brandController.index(dependencies.models))
  router.get("/adicionar", brandController.create(dependencies.models))
  router.post("/adicionar", brandController.create(dependencies.models))
  router.get("/editar/:id", brandController.update(dependencies.models))
  router.post("/editar/:id", brandController.update(dependencies.models))
  router.get("/excluir/:id", brandController.remove(dependencies.models))

  router.get("/autosincronizar/:option", brandController.syncAuto(dependencies))
  router.get(
    "/sincronizar/todos",
    brandController.syncAllBrands(dependencies.models)
  )
  router.get(
    "/sincronizar/:id",
    brandController.syncProducts(dependencies.models)
  )
  router.get(
    "/reiniciar/:id",
    brandController.resetSyncProducts(dependencies.models)
  )

  return router
}

module.exports = init
