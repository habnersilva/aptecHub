const init = models => {
  const express = require("express")
  const bodyParser = require("body-parser")
  const session = require("express-session")
  const path = require("path")
  const routers = require("./routes/index")
  const acl = require("express-acl")

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
    req.session.user = {
      name: "Habner Silva",
      email: "habner@aptec.com.br",
      roles: "tecnico"
    }

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
      //  console.log(user.roles)
      res.locals.user = user
      next()
    }
  })

  acl.config({
    path: "src/config",
    filename: "acl.json",
    baseUrl: "/",
    roleSearchPath: "session.user.roles",
    denyCallback: (req, res) => {
      console.log(res)

      const msg = `"${req.query.action}"` || ""

      req.flash(
        "info",
        `${res.locals.user.name}, você não possui permissão para acessar ${msg}!`
      )

      return res.redirect("back")
    }
  })
  app.use(acl.authorize)

  app.use(routers(models))

  app.set("view engine", "ejs")
  app.set("views", path.join(__dirname, "views"))

  return app
}

module.exports = init
