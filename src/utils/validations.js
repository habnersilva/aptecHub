const trataErrorsSequelize = err => {
  const fieldsErrors = err.errors.reduce((prev, curr) => {
    //  console.log(prev)
    prev[curr.path] = [curr.message]
    return prev
  }, {})

  fieldsErrors.arrayOfFields = Object.keys(fieldsErrors)

  return {
    fields: fieldsErrors,
    global: {
      type: "danger",
      message: "Verifique os campos"
    }
  }
}

const extractErrors = (err = null) => {
  let objError = {
    global: {},
    fields: {
      arrayOfFields: [],
      message: {}
    }
  }

  if (err) {
    switch (err.name) {
      case "SequelizeValidationError":
        objError = trataErrorsSequelize(err)
        break
      case "AptecHubError":
        objError.global = err.errors[0]
        break
    }
  }

  return objError
}

module.exports = {
  extractErrors
}
