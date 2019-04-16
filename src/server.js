const hapi = require('hapi')
const boom = require('boom')
const { getQuote } = require('./providers/iex-provider')
const { UnknownSymbolError } = require('./providers/errors')

const server = hapi.server({
  port: 3000,
  host: '0.0.0.0'
})

server.route({
  method: 'GET',
  path: '/quote',
  handler: async function (request, h) {
    try {
      return await getQuote(request.query.symbol)
    } catch (err) {
      if (err instanceof UnknownSymbolError) {
        return boom.notFound(err.message)
      } else {
        return boom.internal(err.message)
      }
    }
  }
})

exports.init = async () => {
  await server.initialize()
  return server
}

exports.start = async () => {
  await server.start()
  return server
}

/* istanbul ignore next */
process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})
