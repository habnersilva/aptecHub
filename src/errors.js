class aptecHubError extends Error {
  constructor(options) {
    super()
    this.name = "AptecHubError"
    this.errors = options.errors
  }
}

module.exports = aptecHubError
