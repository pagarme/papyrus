import log4js from 'log4js'
import { createMessageBuilder } from '../../../src/message-builder'
import { createRequestLogger } from '../../../src/request-logger'

const ironMask = require('iron-mask')
let reqLogger: any = {}

beforeEach(() => {
  const loggerEngine = log4js.configure({
    appenders: {
      api: {
        type: 'console',
        layout: {
          type: 'pattern',
          pattern: '%m'
        }
      }
    },
    categories: { default: { appenders: ['api'], level: 'info' } }
  })

  const sensitive = {
    password: {
      paths: ['message.password'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  }

  const messageBuilder = createMessageBuilder(ironMask.create(sensitive), 'test')
  const logger = loggerEngine.getLogger()

  const request = [
    'id',
    'method',
    'url',
    'body',
    'user-agent',
    'env'
  ]
  reqLogger = createRequestLogger({
    logger,
    messageBuilder,
    request,
    propMaxLength: {
      body: 15,
      url: 15
    }
  })
})

test('should return body content', () => {
  const expectedBody = {
    foo: 'bar'
  }

  const req = {
    id: 123,
    body: {
      foo: 'bar'
    },
    method: 'POST',
    url: 'https://foobar.com',
    user_agent: 'pagarme-ruby',
    env: {}
  }

  const { body } = reqLogger(req)
  expect(body).toEqual(expectedBody)
})

test('should return empty object', () => {
  const req = {
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

  const { body } = reqLogger(req)

  expect(body).toEqual({})
})

test('should return url without query string parameters', () => {
  const req = {
    id: 123,
    url: '/myurl?prop1=value1&prop2=value2',
    method: 'POST',
    user_agent: 'pagarme-ruby',
    env: {}
  }

  const { url } = reqLogger(req)

  expect(url).toEqual('/myurl?prop1...')
})
