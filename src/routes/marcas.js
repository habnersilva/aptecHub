const init = models => {
  const router = require("express").Router()
  const marcasController = require("../controllers/marcas")

  router.get("/", marcasController.index(models))
  router.get("/adicionar", marcasController.create(models))
  router.post("/adicionar", marcasController.create(models))
  router.get("/editar/:id", marcasController.update(models))
  router.post("/editar/:id", marcasController.update(models))
  router.get("/excluir/:id", marcasController.remove(models))

  router.get("/importar/:id", marcasController.importProducts(models))
  router.get("/enviar/:id", marcasController.sendProducts(models))

  return router
}

module.exports = init
