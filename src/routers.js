const express = require("express")
const router = express.Router()

const dashboardController = require("./controllers/dashboard")
const marcasController = require("./controllers/marcas")

const model = require("./models/index")

router.get("/", dashboardController.index)
router.get("/marcas", marcasController.index.bind(null, model.models))
router.get("/marcas/adicionar", marcasController.create)
router.post(
  "/marcas/adicionar",
  marcasController.createProcess.bind(null, model.models)
)
router.get("/marcas/editar/:id", marcasController.edit.bind(null, model.models))
router.post(
  "/marcas/editar/:id",
  marcasController.editProcess.bind(null, model.models)
)
router.get(
  "/marcas/excluir/:id",
  marcasController.remove.bind(null, model.models)
)

module.exports = router
