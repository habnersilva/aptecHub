const express = require("express")
const router = express.Router()

const dashboard = require("./controllers/dashboard")
const marca = require("./controllers/marca")

router.get("/", dashboard.index)
router.get("/marcas", marca.index)
router.get("/marcas/adicionar", marca.create)

module.exports = router
