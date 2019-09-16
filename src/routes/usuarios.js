const init = models => {
  const router = require("express").Router()
  const usuariosController = require("../controllers/usuarios")

  router.get("/", usuariosController.index(models))

  router.get("/adicionar", usuariosController.create(models))
  router.post("/adicionar", usuariosController.create(models))
  router.get("/editar/:id", usuariosController.update(models))
  router.post("/editar/:id", usuariosController.update(models))
  router.get("/excluir/:id", usuariosController.remove(models))

  return router
}

module.exports = init
