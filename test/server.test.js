const { describe, it, beforeEach, afterEach } = require('mocha')
const { expect } = require('chai')
const sinon = require('sinon')
const rp = require('request-promise-native')
const errors = require('request-promise-native/errors')
const { init } = require('../src/server')

describe('Server', function () {
  let server
  const stub = sinon.stub(rp, 'get')

  beforeEach(async function () {
    server = await init()
  })

  afterEach(async function () {
    await server.stop()
  })

  it('gets a quote', async function () {
    stub.returns(Promise.resolve({
      symbol: 'AAPL',
      companyName: 'Apple Inc.',
      primaryExchange: 'Nasdaq Global Select',
      sector: 'Technology',
      calculationPrice: 'close',
      open: 198.53,
      openTime: 1555335000785,
      close: 199.23,
      closeTime: 1555358400286,
      high: 199.85,
      low: 198.01,
      latestPrice: 199.23,
      latestSource: 'Close',
      latestTime: 'April 15, 2019',
      latestUpdate: 1555358400286,
      latestVolume: 17086013,
      iexRealtimePrice: 199.19,
      iexRealtimeSize: 100,
      iexLastUpdated: 1555358399668,
      delayedPrice: 199.23,
      delayedPriceTime: 1555358400286,
      extendedPrice: 199.12,
      extendedChange: -0.11,
      extendedChangePercent: -0.00055,
      extendedPriceTime: 1555361192875,
      previousClose: 198.87,
      change: 0.36,
      changePercent: 0.00181,
      iexMarketPercent: 0.02538,
      iexVolume: 433643,
      avgTotalVolume: 28954745,
      iexBidPrice: 0,
      iexBidSize: 0,
      iexAskPrice: 0,
      iexAskSize: 0,
      marketCap: 939425234400,
      peRatio: 16.38,
      week52High: 233.47,
      week52Low: 142,
      ytdChange: 0.26652027787758636
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
  })

  it('returns an error if the symbol is not found', async function () {
    stub.returns(Promise.reject(new errors.StatusCodeError(404)))

    const res = await server.inject({
      method: 'GET',
      url: '/quote?symbol=UNKNOWN'
    })

    expect(res.statusCode).to.equal(404)
    expect(res.result.message).to.equal('Unknown symbol: UNKNOWN')
  })

  it('returns an error if there is a general server error', async function () {
    stub.returns(Promise.reject(new errors.StatusCodeError(500)))

    const res = await server.inject({
      method: 'GET',
      url: '/quote?symbol=GOOGL'
    })

    expect(res.statusCode).to.equal(500)
    expect(res.result.message).to.equal('An internal server error occurred')
  })

  it('checks the quote input parameters', async function () {
    const res = await server.inject({
      method: 'GET',
      url: '/quote?blah=foo'
    })

    expect(res.statusCode).to.equal(400)
    expect(res.result.error).to.equal('Bad Request')
  })
})
