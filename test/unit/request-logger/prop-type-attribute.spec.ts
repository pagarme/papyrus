import log4js from 'log4js'
import { createMessageBuilder } from '../../../src/message-builder'
import { createRequestLogger } from '../../../src/request-logger'

const ironMask = require('iron-mask')
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

test('should return parsed body properties', () => {
  const propMaxLength = {}
  const propsToParse = {
    request: {
      'body.id': Number,
      'body.keys': String
    }
  }

  const reqLogger = createRequestLogger({
    logger,
    messageBuilder,
    request,
    propMaxLength,
    propsToParse
  })

  const expectedBody = {
    id: 123,
    keys: '1,2,3',
    foo: 'bar',
    bar: 'foo'
  }

  const req: any = {
    body: {
      id: '123',
      keys: [1, 2, 3],
      foo: 'bar',
      bar: 'foo'
    }
  }
  const { body } = reqLogger(req)
  expect(body).toEqual(expectedBody)
})
