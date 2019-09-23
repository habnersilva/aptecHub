module.exports = (sequelize, DataType) => {
  const Syncs = sequelize.define("Syncs", {
    type: {
      type: DataType.STRING
    },
    size: {
      type: DataType.STRING
    },
    totalProducts: {
      type: DataType.INTEGER
    },
    filePath: {
      type: DataType.STRING
    },
    lastFile: {
      type: DataType.BOOLEAN
    }
  })

  Syncs.associate = ({ Brands }) => {
    Syncs.belongsTo(Brands)
  }

  return Syncs
}
