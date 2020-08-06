const test = require('ava')

const { buildResLog } = require('../../../src/response-logger')

let buildLogResult = {}

test.before(() => {
  const propsToLog = [
    'id',
    'method',
    'url',
    'body',
    'user-agent',
    'env'
  ]

  buildLogResult = buildResLog(propsToLog)
})

test('should return body content', t => {
  const expectedBody = {
    foo: 'bar'
  }

  const req = {
  }

  const res = {
    statusCode: 200,
    id: 123,
    body: {
      foo: 'bar'
    },
    method: 'POST',
    url: 'https://foobar.com',
    user_agent: 'pagarme-ruby',
    env: {}
  }

  const { body } = buildLogResult({ req, res })

  t.deepEqual(body, expectedBody)
})

test('should return the correct url', t => {
  const req = {
    url: 'https://url.com',
    originalUrl: 'https://original-url.com'
  }

  const res = {
    statusCode: 200,
    id: 123,
    method: 'POST',
    user_agent: 'pagarme-ruby',
    env: {}
  }

  let log = buildLogResult({ req, res })

  t.is(log.url, req.originalUrl)

  req.originalUrl = ''

  log = buildLogResult({ req, res })

  t.is(log.url, req.url)
})
