const express = require("express")
const router = express.Router()

const dashboardController = require("./controllers/dashboard")
const marcaController = require("./controllers/marca")

router.get("/", dashboardController.index)
router.get("/marcas", marcaController.index)
router.get("/marcas/adicionar", marcaController.create)
router.get("/marcas/editar/:id", marcaController.edit)
router.get("/marcas/deletar/:id", marcaController.remove)

module.exports = router
