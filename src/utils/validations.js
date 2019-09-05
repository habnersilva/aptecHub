const extractErrors = (err = null) => {
  const objError = {
    error: {},
    fields: []
  }

  if (err) {
    const errors = err.errors.reduce((prev, curr) => {
      prev[curr.path] = [curr.message]
      return prev
    }, {})

    objError.errors = errors
    objError.fields = Object.keys(errors)
  }

  return objError
}

module.exports = {
  extractErrors
}
