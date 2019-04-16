const rp = require('request-promise-native')
const { UnknownSymbolError } = require('./errors')

module.exports.getQuote = async (symbol) => {
  return rp.get({
    uri: 'https://api.iextrading.com/1.0/stock/' + symbol + '/quote',
    json: true,
    timeout: 3000
  }).then((quote) => {
    return {
      symbol: quote.symbol,
      company: quote.companyName,
      price: quote.latestPrice,
      priceTime: quote.latestUpdate
    }
  }).catch((err) => {
    if (err.statusCode === 404) {
      throw new UnknownSymbolError('Unknown symbol: ' + symbol)
    } else {
      throw new Error('Error retrieving quote: ' + err.message)
    }
  })
}
