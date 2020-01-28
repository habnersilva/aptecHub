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
    platform: {
      type: DataType.STRING,
      validate: {
        notEmpty: {
          msg: "Preencha o campo da Plataforma"
        },
        isIn: {
          args: [["aptecweb", "icone", "tray"]],
          msg: "Você não escolheu a plataforma"
        }
      }
    },
    linkGoogleShopping: {
      type: DataType.STRING,
      validate: {
        notEmpty: {
          msg: "Preencha o campo do Link do Google Shopping"
        }
      }
    },
    fidexGender: {
      type: DataType.STRING
    }
  })

  Brands.associate = ({ Syncs }) => {
    Brands.hasMany(Syncs)
  }

  return Brands
}
