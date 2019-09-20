module.exports = (sequelize, DataType) => {
  const Syncs = sequelize.define("Syncs", {
    type: {
      type: DataType.STRING
    },
    size: {
      type: DataType.STRING
    },
    totalOfProducts: {
      type: DataType.INTEGER
    },
    filePath: {
      type: DataType.STRING
    },
    lastFile: {
      type: DataType.BOOLEAN
    }
  })

  Syncs.associate = models => {
    Syncs.belongsTo(models.Brands)
  }

  return Syncs
}
