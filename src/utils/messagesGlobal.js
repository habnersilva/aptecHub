/*!
 * Adaptado por Habner Silva
 * Express - Contrib - messages
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

module.exports = function(req, res) {
  return function(type, message) {
    let output = ""

    if (type && message)
      output = `<div class="alert alert-${type}" role="alert"><p class="mb-0">${message}</p></div>`

    return output
  }
}
