const bcrypt = require("bcryptjs")

const UsuarioModel = (sequelize, DataType) => {
  const UsuarioSequelize = sequelize.define(
    "Usuarios",
    {
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
          notEmpty: {
            msg: "Preencha o campo E-mail"
          },
          isEmail: {
            msg: "Verifique se o e-mail está correto"
          },
          len: {
            args: [3, 60],
            msg: "O e-mail deve conter mais de 3 caracteres"
          }
        }
      },
      passwd: {
        type: DataType.STRING,
        validate: {
          notEmpty: {
            msg: "Preencha o campo Senha"
          }
        }
      },
      email_checked: DataType.TINYINT,
      roles: DataType.STRING
    },
    {
      hooks: {
        beforeCreate: user => {
          const salt = bcrypt.genSaltSync(10)
          user.passwd = bcrypt.hashSync(user.passwd, salt)
        }
      }
    }
  )

  UsuarioSequelize.authenticate = async (email, passwd) => {
    const user = await UsuarioSequelize.findOne({ where: { email } })

    if (!user) {
      throw new Error("Usuário Inválido")
    }

    if (!bcrypt.compareSync(passwd, user.passwd)) {
      throw new Error("Senha Inválida")
    }
    return user
  }

  return UsuarioSequelize
}

module.exports = UsuarioModel
