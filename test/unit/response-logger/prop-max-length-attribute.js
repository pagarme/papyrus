const { test } = require('ava')

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

  const propMaxLength = {
    body: 15,
    url: 15
  }

  buildLogResult = buildResLog(propsToLog, propMaxLength)
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

test('should return empty array', t => {
  const req = {
  }

  const res = {
    statusCode: 200,
    id: 123,
    body: [{
      foo: 'bar',
      bar: 'foo'
    }],
    method: 'POST',
    url: 'https://foobar.com',
    user_agent: 'pagarme-ruby',
    env: {}
  }

  const { body } = buildLogResult({ req, res })

  t.deepEqual(body, [])
})

test('should return url without query string parameters', t => {
  const req = {
    url: '/myurl?prop1=value1&prop2=value2'
  }

  const res = {
    statusCode: 200,
    id: 123,
    body: {
      foo: 'bar',
      bar: 'foo'
    },
    method: 'POST',
    user_agent: 'pagarme-ruby',
    env: {}
  }

  const { url } = buildLogResult({ req, res })

  t.deepEqual(url, '/myurl?prop1...')
})
