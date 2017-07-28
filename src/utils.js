const R = require('ramda')
const pokeprop = require('pokeprop')

const parseStringToJSON = chunk => (
  Promise.resolve(chunk)
    .then(JSON.parse)
    .catch(err => chunk)
)

const buildErrorObject = R.pick(['message', 'stack'])

const stringify = log => {
  if (R.is(String, log)) return log
  if (R.is(Error, log.message)) log.message = buildErrorObject(log.message)
  return JSON.stringify(log)
}

const pickProperties = R.flip(pokeprop)

const generateLogLevel = statusCode => {
  if (statusCode < 400 || R.isNil(statusCode)) return 'info'
  if (statusCode < 500) return 'warn'
  return 'error'
}

const isVendorLoggerValid = vendor => {
  if (!R.is(Object, vendor)) return false
  const levels = ['debug', 'error', 'warn', 'info']
  const validationResult = levels.map(level => R.is(Function, vendor[level]))
  return !R.contains(false, validationResult)
}

module.exports = {
  parseStringToJSON,
  pickProperties,
  generateLogLevel,
  isVendorLoggerValid,
  stringify
}
