const rp = require('request-promise-native')

class UnknownSymbolError extends Error {
  constructor (message) {
    super(message)
    this.name = 'UnknownSymbolError'
  }
}

module.exports.UnknownSymbolError = UnknownSymbolError

module.exports.getQuote = async (symbol) => {
  return rp.get({
    uri: 'https://api.iextrading.com/1.0/stock/' + symbol + '/quote',
    json: true
  }).then((quote) => {
    return { quote: quote.latestPrice }
  }).catch((err) => {
    if (err.statusCode === 404) {
      throw new UnknownSymbolError('Unknown symbol: ' + symbol)
    } else {
      throw new Error('A general server error has occurred')
    }
  })
}
