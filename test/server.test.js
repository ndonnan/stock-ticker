const { describe, it, beforeEach, afterEach } = require('mocha')
const { expect } = require('chai')
const sinon = require('sinon')
const rp = require('request-promise-native')
const errors = require('request-promise-native/errors')
const { init } = require('../src/server')

describe('Server', function () {
  let server

  beforeEach(async function () {
    server = await init()
  })

  afterEach(async function () {
    await server.stop()
  })

  it('gets a quote', async function () {
    const stub = sinon.stub(rp, 'get')
    stub.returns(Promise.resolve({
      symbol: 'AAPL',
      companyName: 'Apple Inc.',
      latestPrice: 199.23,
      latestUpdate: 1555358400286
    }))

    const res = await server.inject({
      method: 'GET',
      url: '/quote?symbol=AAPL'
    })

    expect(res.statusCode).to.equal(200)
    expect(res.result.symbol).to.equal('AAPL')
    expect(res.result.company).to.equal('Apple Inc.')
    expect(res.result.price).to.equal(199.23)
    expect(res.result.priceTime).to.equal(1555358400286)
    stub.restore()
  })

  it('returns an error if the symbol is not found', async function () {
    const stub = sinon.stub(rp, 'get')
    stub.returns(Promise.reject(new errors.StatusCodeError(404)))

    const res = await server.inject({
      method: 'GET',
      url: '/quote?symbol=UNKNOWN'
    })

    expect(res.statusCode).to.equal(404)
    expect(res.result.message).to.equal('Unknown symbol: UNKNOWN')
    stub.restore()
  })

  it('returns an error if there is a general server error', async function () {
    const stub = sinon.stub(rp, 'get')
    stub.returns(Promise.reject(new errors.StatusCodeError(500)))

    const res = await server.inject({
      method: 'GET',
      url: '/quote?symbol=GOOGL'
    })

    expect(res.statusCode).to.equal(500)
    expect(res.result.message).to.equal('An internal server error occurred')
    stub.restore()
  })

  it('checks the quote input parameters', async function () {
    const res = await server.inject({
      method: 'GET',
      url: '/quote?blah=foo'
    })

    expect(res.statusCode).to.equal(400)
    expect(res.result.error).to.equal('Bad Request')
  })

  it('should return quote from the cache', async function () {
    const stub = sinon.stub(rp, 'get')
    stub.returns(Promise.resolve({
      symbol: 'AAPL',
      companyName: 'Apple Inc.',
      latestPrice: 199.23,
      latestUpdate: 1555358400286
    }))

    const req = {
      method: 'GET',
      url: '/quote?symbol=AAPL'
    }

    const res = await server.inject(req)

    expect(res.statusCode).to.equal(200)
    expect(res.result.price).to.equal(199.23)

    // Expect the second call to return a cached quote
    const secondRes = await server.inject(req)

    expect(secondRes.statusCode).to.equal(200)
    expect(secondRes.result.price).to.equal(199.23)
    sinon.assert.calledOnce(stub)
    stub.restore()
  })
})
