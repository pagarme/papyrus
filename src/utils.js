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
  const dotSplit = R.split('.')
  const isNull = prop => R.isNil(R.path(R.split('.', prop), message))

  const pickProp = prop => ({ path: dotSplit(prop), value: R.path(dotSplit(prop), message) })
  const buildProps = R.map(R.ifElse(isNull, R.always({}), pickProp))
  const mergePickedProps = pickedProps => R.reduce(addPickedProp, {}, pickedProps)

  const addPickedProp = (merged, { path, value }) => {
    if (!path) return merged
    return R.set(R.lensPath(path), value, merged)
  }

  return R.pipe(buildProps, mergePickedProps)(propsToLog)
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
