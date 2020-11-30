import log4js from 'log4js'
import winston, { format, transports } from 'winston'
import * as utils from '../../src/utils'

const ironMask = require('iron-mask')
const maskJson = require('mask-json')
const log4jsLogger = log4js.getLogger()
const { combine, timestamp, label, prettyPrint } = format
const winstonLogger = winston.createLogger({
  format: combine(
    label({ label: 'right meow!' }),
    timestamp(),
    prettyPrint()
  ),
  transports: [new transports.Console()]
})

test('parseStringToJSON: with a valid JSON string', async () => {
  const result = await utils.parseStringToJSON(JSON.stringify({ name: 'Papyrus' }))
  expect(result).toEqual({ name: 'Papyrus' })
})

test('parseStringToJSON: with a simple JSON string', async () => {
  const result = await utils.parseStringToJSON(JSON.stringify('Papyrus'))
  expect(result).toBe('Papyrus')
})

test('parseStringToJSON: with a invalid JSON string', async () => {
  const invalidJson = 'invalid json'
  const result = await utils.parseStringToJSON(invalidJson)
  expect(result).toBe(invalidJson)
})

test('stringify: with a valid JSON object', () => {
  expect(utils.stringify({ name: 'Papyrus' })).toBe('{"name":"Papyrus"}')
})

test('stringify: with a invalid JSON object', () => {
  expect(utils.stringify('Papyrus')).toBe('Papyrus')
})

test('stringify: with a valid error object', () => {
  const err = new Error('Error Message')

  const logStringified = utils.stringify({
    id: 1,
    message: err
  })

  const logObject = JSON.parse(logStringified)
  const logError = logObject.message

  expect(logError.message).toBe(err.message)
  expect(logError.stack.includes('Error: Error Message')).toBe(true)
})

test('stringify: with a valid nested error object with multiple properties', () => {
  const innerErr: any = new Error('Inner error message')
  innerErr.username = 'foo'
  innerErr.isValidUsername = true

  const err: any = new Error('Error message')
  err.cause = innerErr
  err.correlationId = '4ac1-b431-cab1-4c1a'

  const logStringified = utils.stringify({
    id: 1,
    message: err
  })

  const logObject = JSON.parse(logStringified)
  const logError = logObject.message

  expect(logError.message).toBe(err.message)
  expect(logError.correlationId).toBe(err.correlationId)
  expect(logError.stack.includes('Error: Error message')).toBe(true)

  expect(logError.cause.message).toBe(innerErr.message)
  expect(logError.cause.username).toBe(innerErr.username)
  expect(logError.cause.isValidUsername).toBe(innerErr.isValidUsername)
  expect(logError.cause.stack.includes('Error: Inner error message')).toBe(true)
})

test('generateLogLevel: with status code 400', () => {
  expect(utils.generateLogLevel(400)).toBe('warn')
})

test('generateLogLevel: with status code 500', () => {
  expect(utils.generateLogLevel(500)).toBe('error')
})

test('generateLogLevel: with status code 200', () => {
  expect(utils.generateLogLevel(200)).toBe('info')
})

test('generateLogLevel: with a invalid status code', () => {
  expect(utils.generateLogLevel(undefined as any)).toBe('info')
})

test('isVendorLoggerValid: with a log4js instance', () => {
  expect(utils.isVendorLoggerValid(log4jsLogger)).toBe(true)
})

test('isVendorLoggerValid: with a winston instance', () => {
  expect(utils.isVendorLoggerValid(winstonLogger)).toBe(true)
})

test('isVendorLoggerValid: with a undefined logger instance', () => {
  expect(utils.isVendorLoggerValid(undefined)).toBe(false)
})

test('isVendorLoggerValid: with a invalid logger instance', () => {
  expect(utils.isVendorLoggerValid({ info: () => 1 })).toBe(false)
})

test('isIronMaskVendor: with an iron-mask instance', () => {
  expect(utils.isIronMaskVendor(ironMask)).toBe(true)
})

test('isIronMaskVendor: with a mask-json instance', () => {
  expect(utils.isIronMaskVendor(maskJson)).toBe(false)
})

test('isMaskJsonVendor: with a mask-json instance', () => {
  expect(utils.isMaskJsonVendor(maskJson)).toBe(true)
})

test('isMaskJsonVendor: with an iron-mask instance', () => {
  expect(utils.isMaskJsonVendor(ironMask)).toBe(false)
})

test('parsePropsType: with a valid propsToParse parameter', () => {
  const reqProps = {
    body: {
      id: 123
    }
  }

  const propsToParse = {
    'body.id': String
  }

  const expectedAssertion = {
    body: {
      id: '123'
    }
  }

  expect(utils.parsePropsType(reqProps, propsToParse)).toEqual(expectedAssertion)
})

test('parsePropsType: with an invalid propsToParse parameter', () => {
  const reqProps = {
    body: {
      id: 123
    }
  }

  const propsToParse = {
    'body.foobar': String
  }

  const expectedAssertion = {
    body: {
      id: 123
    }
  }

  expect(utils.parsePropsType(reqProps, propsToParse)).toEqual(expectedAssertion)
})

test('parsePropsType: with a falsy parameter value', () => {
  const reqProps = {
    body: {
      amount: 0
    }
  }

  const propsToParse = {
    'body.amount': String
  }

  const expectedAssertion = {
    body: {
      amount: '0'
    }
  }

  expect(utils.parsePropsType(reqProps, propsToParse)).toEqual(expectedAssertion)
})
