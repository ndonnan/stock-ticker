const hapi = require('hapi')

const server = hapi.server({
  port: 3000,
  host: '0.0.0.0'
})

server.route({
  method: 'GET',
  path: '/',
  handler: function () {
    return 'Hello World!'
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
