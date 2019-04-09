const { expect } = require('chai')
const { describe, it } = require('mocha')
const { start } = require('../src/server')

describe('Server', function () {
  it('starts without errors', async function () {
    const server = await start()
    expect(server.info.started).to.be.a('number')
    await server.stop()
  })
})
