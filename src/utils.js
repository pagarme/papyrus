const R = require('ramda')

const parseStringToJSON = chunk => (
  Promise.resolve(chunk)
    .then(JSON.parse)
    .catch(err => chunk)
)

const stringify = msg => {
  if (R.is(String, msg)) return msg
  return JSON.stringify(msg)
}

const pickProperties = (message, propsToLog) => {
  const isNull = prop => R.isNil(message[prop])
  const pick = prop => R.pick([prop], message)
  const propsToLogMap = R.map(R.ifElse(isNull, R.always({}), pick))
  return R.pipe(propsToLogMap, R.mergeAll)(propsToLog)
}

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
