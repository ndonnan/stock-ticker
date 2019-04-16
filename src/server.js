const hapi = require('hapi')
const { getQuote, UnknownSymbolError } = require('./handlers')

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
        return h.response(err.message).code(404)
      } else {
        return h.response(err.message).code(500)
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
