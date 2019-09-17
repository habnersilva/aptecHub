const models = {}
const fs = require("fs")
const path = require("path")
const Sequelize = require("sequelize")
const sequelize = new Sequelize(
  process.env.MYSQL_DBNAME,
  process.env.MYSQL_USER,
  "",
  {
    dialect: "mysql",
    host: process.env.MYSQL_HOST,
    logging: false
  }
)

// Importa tabelas em database
fs.readdirSync(__dirname)
  .filter(file => file !== "index.js")
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file))
    models[model.name] = model
  })

// Criar o primeiro Usuario
const initialUser = async id => {
  const count = await models.Usuarios.count()
  if (count === 0) {
    // criar um usuario admin
    await models.Usuarios.create({
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
