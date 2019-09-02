const init = models => {
  console.log("marca Routes", models)

  const router = require("express").Router()
  const marcasController = require("../controllers/marcas")

  router.get("/", marcasController.index(models))
  router.get("/adicionar", marcasController.create())
  router.post("/adicionar", marcasController.createProcess(models))
  router.get("/editar/:id", marcasController.edit(models))
  router.post("/editar/:id", marcasController.editProcess(models))
  router.get("/excluir/:id", marcasController.remove(models))

  return router
}

module.exports = init
