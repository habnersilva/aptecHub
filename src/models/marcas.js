const MarcasModel = (sequelize, DataType) => {
  const MarcaSequelize = sequelize.define("Marcas", {
    name: DataType.STRING,
    email: DataType.STRING
  })

  return MarcaSequelize
}

module.exports = MarcasModel
