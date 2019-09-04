const Joi = require("@hapi/joi")
const validations = require("../utils/validations")

const createSchema = Joi.object().keys({
  name: Joi.string()
    .min(5)
    .max(245)
    .required(),
  email: Joi.string()
    .min(5)
    .required()
})

const MarcasModel = (sequelize, DataType) => {
  const MarcaSequelize = sequelize.define("Marcas", {
    name: DataType.STRING,
    email: DataType.STRING
  })

  MarcaSequelize.beforeCreate((marca, options) => {
    const value = validations.validate(marca, createSchema)
  })

  return MarcaSequelize
}

module.exports = MarcasModel
