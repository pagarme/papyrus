const log4js = require('log4js').getLogger()
const winston = require('winston')

const { test } = require('ava')
const utils = require('../../src/utils')

test('parseStringToJSON: with a valid JSON string', t => ( 
  utils.parseStringToJSON(JSON.stringify({ name: 'Papyrus' }))
    .then(result => t.deepEqual(result, { name: 'Papyrus' }))
))

test('parseStringToJSON: with a invalid JSON string', t => (
  utils.parseStringToJSON(JSON.stringify('Papyrus'))
    .then(result => t.is(result, 'Papyrus'))
))

test('stringify: with a valid JSON object', t => {
  t.is(utils.stringify({ name: 'Papyrus' }), '{"name":"Papyrus"}')
})

test('stringify: with a invalid JSON object', t => {
  t.is(utils.stringify('Papyrus'), 'Papyrus')
})

test('generateLogLevel: with status code 400', t => {
  t.is(utils.generateLogLevel(400), 'warn')
})

test('generateLogLevel: with status code 500', t => {
  t.is(utils.generateLogLevel(500), 'error')
})

test('generateLogLevel: with status code 200', t => {
  t.is(utils.generateLogLevel(200), 'info')
})

test('generateLogLevel: with a invalid status code', t => {
  t.is(utils.generateLogLevel(undefined), 'info')
})

test('isVendorLoggerValid: with a log4js instance', t => {
  t.is(utils.isVendorLoggerValid(log4js), true)
})

test('isVendorLoggerValid: with a winston instance', t => {
  t.is(utils.isVendorLoggerValid(winston), true)
})

test('isVendorLoggerValid: with a invalid logger instance', t => {
  t.is(utils.isVendorLoggerValid({ info: () => 1 }), false)
})
