module.exports = (sequelize, DataType) => {
  const Brands = sequelize.define("Brands", {
    name: {
      type: DataType.STRING,
      validate: {
        notEmpty: {
          msg: "Preencha o campo Nome"
        }
      }
    },
    email: {
      type: DataType.STRING,
      validate: {
        isEmail: {
          msg: "Verifique se o e-mail está correto"
        },
        len: {
          args: [3, 60],
          msg: "O e-mail deve conter mais de 3 caracteres"
        },
        notEmpty: {
          msg: "Preencha o campo E-mail"
        }
      }
    },
    domain: {
      type: DataType.STRING,
      validate: {
        notEmpty: {
          msg: "Preencha o campo Domínio"
        }
      }
    },
    appKey: {
      type: DataType.STRING,
      validate: {
        notEmpty: {
          msg: "Preencha o campo appKey"
        }
      }
    }
  })

  Brands.associate = ({ Syncs }) => {
    Brands.hasMany(Syncs)
  }

  return Brands
}
