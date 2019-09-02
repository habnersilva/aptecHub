require("dotenv").config()

const { sequelize, models } = require("./models/index")

const port = process.env.PORT || 3000

const server = require("./app")(models)

sequelize.sync().then(() => {
  server.listen(port, () => {
    console.log("Server listening in http://localhost:" + port)
  })
})
