const models = {}
const fs = require("fs")
const path = require("path")
const Sequelize = require("sequelize")
const sequelize = new Sequelize(
  process.env.MYSQL_DBNAME,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.MYSQL_HOST,
    logging: false
  }
)

// Importa tabelas em database
fs.readdirSync(__dirname)
  .filter(file => file !== "indexModel.js")
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file))
    models[model.name] = model
  })

Object.keys(models).forEach(modelName => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models)
  }
})

// Criar o primeiro Usuario
const initialUser = async id => {
  const count = await models.Users.count()
  if (count === 0) {
    // criar um usuario admin
    await models.Users.create({
      name: "Habner Silva",
      email: "habner@aptec.com.br",
      passwd: "123",
      email_checked: true,
      role: "administrador"
    })
  }
}

module.exports = {
  sequelize,
  models,
  initialUser
}
