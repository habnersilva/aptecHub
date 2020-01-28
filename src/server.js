require("dotenv").config()

const { sequelize, models, initialUser } = require("./models/indexModel")

const port = process.env.PORT || 3000

const server = require("./app")(models)

sequelize
  .sync({ force: false })
  .then(() => {
    // Criar o primeiro Usuario
    initialUser()

    server.listen(port, () => {
      console.log("Server listening in http://localhost:" + port)
    })
  })
  .catch(err => {
    console.log(err)
  })
