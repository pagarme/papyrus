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
    request
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

test('should return the correct url', () => {
  const req = {
    url: 'https://url.com',
    originalUrl: 'https://original-url.com'
  }

  let log: any = reqLogger(req)

  expect(log.url).toBe(req.originalUrl)

  req.originalUrl = ''

  log = reqLogger(req)

  expect(log.url).toBe(req.url)
})
