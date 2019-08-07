const { test } = require('ava')

const { buildResLog } = require('../../src/response-logger')

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
  buildLogResult = buildResLog(propsToLog, 15)
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

test('should return empty object', t => {
  const req = {
  }

  const res = {
    statusCode: 200,
    id: 123,
    body: {
      foo: 'bar',
      bar: 'foo'
    },
    method: 'POST',
    url: 'https://foobar.com',
    user_agent: 'pagarme-ruby',
    env: {}
  }

  const { body } = buildLogResult({ req, res })

  t.deepEqual(body, {})
})
