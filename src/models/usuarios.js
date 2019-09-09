const bcrypt = require("bcryptjs")
const aptecHubError = require("../errors")

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
          len: {
            args: [3, 60],
            msg: "O e-mail deve conter mais de 3 caracteres"
          },
          isEmail: {
            msg: "Verifique se o e-mail está correto"
          },
          notEmpty: {
            msg: "Preencha o campo E-mail"
          }
        }
      },
      passwd: {
        type: DataType.STRING,
        validate: {
          len: {
            args: [3, 25],
            msg: "O e-mail deve conter mais de 3 caracteres"
          },
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
    await UsuarioSequelize.build({ email, passwd }).validate()

    const user = await UsuarioSequelize.findOne({ where: { email } })

    if (!user) {
      throw new aptecHubError({
        errors: [
          {
            path: "global",
            type: "danger",
            message: "Usuário Inválido."
          }
        ]
      })
    }

    if (!bcrypt.compareSync(passwd, user.passwd)) {
      throw new aptecHubError({
        errors: [
          {
            path: "global",
            type: "danger",
            message: "Senha Inválida."
          }
        ]
      })
    }

    return user
  }

  return UsuarioSequelize
}

module.exports = UsuarioModel
