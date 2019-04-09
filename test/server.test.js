const { expect } = require('chai')
const { describe, it, beforeEach, afterEach } = require('mocha')
const { init } = require('../src/server')

describe('Server', function () {
  let server

  beforeEach(async function () {
    server = await init()
  })

  afterEach(async function () {
    await server.stop()
  })

  it('responds with 200 on the base url', async function () {
    const res = await server.inject({
      method: 'GET',
      url: '/'
    })
    expect(res.statusCode).to.equal(200)
  })
})
