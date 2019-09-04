require("dotenv").config()

const { sequelize, models, initialUser } = require("./models/index")

const port = process.env.PORT || 3000

const server = require("./app")(models)

initialUser()

sequelize.sync({ force: false }).then(() => {
  server.listen(port, () => {
    console.log("Server listening in http://localhost:" + port)
  })
})
