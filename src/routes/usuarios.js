const init = models => {
  const router = require("express").Router()
  const usuariosController = require("../controllers/usuarios")

  router.get("/", usuariosController.index(models))
  router.get("/editar/:id", usuariosController.update(models))
  router.post("/editar/:id", usuariosController.update(models))
  router.get("/excluir/:id", usuariosController.remove(models))

  router.get("/meusdados/:id", usuariosController.update(models))
  router.post("/meusdados/:id", usuariosController.update(models))

  return router
}

module.exports = init
