class UnknownSymbolError extends Error {
  constructor (message) {
    super(message)
    this.name = 'UnknownSymbolError'
  }
}

module.exports.UnknownSymbolError = UnknownSymbolError
