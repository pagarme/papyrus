const test = require('ava')
const log4js = require('log4js')
const ironMask = require('iron-mask')

const { createRequestLogger } = require('../../../src/request-logger')
const { createMessageBuilder } = require('../../../src/message-builder.js')

let reqLogger = {}

test.before(() => {
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
  })
})

test('should return body content', t => {
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
  t.deepEqual(body, expectedBody)
})
