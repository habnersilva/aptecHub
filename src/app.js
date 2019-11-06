const init = models => {
  const express = require("express")
  const bodyParser = require("body-parser")
  const session = require("express-session")
  const path = require("path")
  const routers = require("./routes/indexRoutes")
  const cron = require("cron")

  app = express()

  // Body Parser
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(
    session({
      secret: "AptecHubSession",
      name: "sessionId",
      resave: true,
      saveUninitialized: true
      //  cookie: { secure: true }
    })
  )
  app.use(express.static("./dist/public"))
  app.use(require("connect-flash")())

  //Middleware
  app.use(async (req, res, next) => {
    // req.session.user = {
    //   id: "1",
    //   name: "Habner Silva",
    //   email: "habner@aptec.com.br",
    //   role: "administrador"
    // }

    // Seta messages global
    res.locals.messagesGlobal = require("./utils/messagesGlobal")(req, res)
    res.locals.messagesFlash = require("express-messages")(req, res)

    const { user } = req.session

    if (!user) {
      if (req.path !== "/login" && req.path !== "/login/cadastrese") {
        res.redirect("/login")
      } else {
        next()
      }
    } else {
      res.locals.user = user
      next()
    }
  })

  // dependencias
  const dependencies = {
    models,
    tasks: require("./tasks/indexTasks")(cron, models)
  }

  app.use(routers(dependencies))
  app.disable("x-powered-by")

  app.set("view engine", "ejs")
  app.set("views", path.join(__dirname, "views"))

  return app
}

module.exports = init
