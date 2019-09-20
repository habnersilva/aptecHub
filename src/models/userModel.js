const bcrypt = require("bcryptjs")
const aptecHubError = require("../errors")

const hashPasswd = (user, opt) => {
  if (user.passwd && opt.fields.indexOf("passwd") >= 0) {
    const salt = bcrypt.genSaltSync(10)
    user.passwd = bcrypt.hashSync(user.passwd, salt)
  }
  return user
}

const UsersModel = (sequelize, DataType) => {
  const Users = sequelize.define("Users", {
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
      unique: {
        args: true,
        msg: "Este e-mail já possui cadastro"
      },
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
    role: {
      type: DataType.STRING,
      defaultValue: ""
    }
  })

  // METHODS
  Users.authenticate = async (email, passwd) => {
    await Users.build({ email, passwd }).validate()

    const user = await Users.findOne({ where: { email } })

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

    if (!user.role) {
      throw new aptecHubError({
        errors: [
          {
            path: "global",
            type: "warning",
            message:
              "Sua conta não foi aprovada. Entre em contato com a administração."
          }
        ]
      })
    }

    return user
  }

  Users.permissionAccessMyData = req => {
    const { id } = req.params
    const { user } = req.session

    if (parseInt(id) !== parseInt(user.id) && user.role !== "administrador") {
      throw new aptecHubError({
        errors: [
          {
            path: "global",
            type: "warning",
            message: "Você não possui permissão de acesso."
          }
        ]
      })
    }
  }

  // HOOKS
  Users.beforeCreate(hashPasswd)
  Users.beforeUpdate(hashPasswd)

  return Users
}

module.exports = UsersModel
