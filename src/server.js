const Hapi = require('hapi')
const Boom = require('boom')
const Joi = require('joi')
const Inert = require('inert')
const Vision = require('vision')
const HapiSwagger = require('hapi-swagger')
const Package = require('../package')
const { getQuote } = require('./providers/iex-provider')
const { UnknownSymbolError } = require('./providers/errors')

const server = Hapi.server({
  port: 3000,
  host: '0.0.0.0'
})

// Set up cached methods
server.method('quote', getQuote, {
  cache: {
    expiresIn: 30 * 1000,
    generateTimeout: 5000
  }
})

// Set up routes
server.route({
  method: 'GET',
  path: '/quote',
  handler: async function (request, h) {
    try {
      const { symbol } = request.query
      return await server.methods.quote(symbol)
    } catch (err) {
      if (err instanceof UnknownSymbolError) {
        return Boom.notFound(err.message)
      } else {
        return Boom.internal(err.message)
      }
    }
  },
  options: {
    tags: ['api'],
    description: 'Get a stock quote',
    validate: {
      query: {
        symbol: Joi.string().alphanum().required()
      }
    }
  }
})

const registerPlugins = async (server) => {
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: 'Stock Ticker API Documentation',
          version: Package.version
        }
      }
    }
  ])
}

exports.init = async () => {
  try {
    await server.initialize()
  } catch (err) { }
  return server
}

exports.start = async () => {
  await registerPlugins(server)
  await server.start()
  return server
}

/* istanbul ignore next */
process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})
