const bcrypt = require("bcryptjs")

// const generateHash = passwd => {
//   const salt = bcrypt.genSaltSync(10)
//   const hash = bcrypt.hashSync(passwd, salt)
//   return hash
// }

const UsuarioModel = (sequelize, DataType) => {
  const UsuarioSequelize = sequelize.define(
    "Usuarios",
    {
      name: DataType.STRING,
      email: DataType.STRING,
      passwd: DataType.STRING,
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
