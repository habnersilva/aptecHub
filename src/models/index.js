const models = {}
const fs = require("fs")
const path = require("path")
const Sequelize = require("sequelize")
const sequelize = new Sequelize("aptec-hub", "root", "", {
  dialect: "mysql",
  host: "127.0.0.1"
})

// Importa tabelas em database
fs.readdirSync(__dirname)
  .filter(file => file !== "index.js")
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file))
    models[model.name] = model
  })

module.exports = {
  sequelize,
  models
}
