const { start } = require('./server')

start().then((server) => {
  console.log(`Server running at: ${server.info.uri}`)
})
