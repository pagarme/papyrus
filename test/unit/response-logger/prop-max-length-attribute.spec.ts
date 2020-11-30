import { buildResLog } from '../../../src/response-logger'

let buildLogResult: any = {}

beforeEach(() => {
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

test('should return body content', () => {
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

  expect(body).toEqual(expectedBody)
})

test('should return empty object', () => {
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

  expect(body).toEqual({})
})

test('should return empty array', () => {
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

  expect(body).toEqual([])
})

test('should return url without query string parameters', () => {
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

  expect(url).toEqual('/myurl?prop1...')
})
