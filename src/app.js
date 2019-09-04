const init = models => {
  const express = require("express")
  const bodyParser = require("body-parser")
  const session = require("express-session")
  const path = require("path")
  const routers = require("./routes/index")

  app = express()

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(
    session({
      secret: "AptecHubSession",
      name: "sessionId"
    })
  )
  app.use(express.static("./dist/public"))

  //Middleware
  app.use(async (req, res, next) => {
    const { user } = req.session

    if (!user) {
      if (req.path !== "/login") {
        res.redirect("/login")
      } else {
        next()
      }
    } else {
      res.locals = {
        user
      }

      next()
    }
  })

  app.use(routers(models))

  app.set("view engine", "ejs")
  app.set("views", path.join(__dirname, "views"))

  return app
}

module.exports = init
