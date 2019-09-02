const init = models => {
  const express = require("express")
  const bodyParser = require("body-parser")
  const path = require("path")
  const routers = require("./routes/index")

  app = express()

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(express.static("./dist/public"))
  app.use(routers(models))

  app.set("view engine", "ejs")
  app.set("views", path.join(__dirname, "views"))

  return app
}

module.exports = init
