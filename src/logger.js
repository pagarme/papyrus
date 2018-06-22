const R = require('ramda')
const cuid = require('cuid')
const { stringify } = require('./utils')

const buildLog = messageBuilder => (message, level, additional) => {
  const defaultAdditional = R.defaultTo({}, additional)
  const log = messageBuilder(Object.assign(
    { id: cuid(), message, level }, defaultAdditional
  ))
  return log
}

const createProxyLevels = (buildLog, logger) => {
  const levels = ['trace', 'fatal', 'debug', 'error', 'warn', 'info']
  return levels.map(lvl => ({ [lvl]: (msg, additional) => (
    logger[lvl](stringify(buildLog(msg, lvl, additional)))
  )}))
}

const logger = (vendorLogger, messageBuilder) => (
  Object.assign({}, ...createProxyLevels(buildLog(messageBuilder), vendorLogger))
)

module.exports = { createLogger: logger }
