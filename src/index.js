const ironMask = require('iron-mask')

const { createLogger } = require('./logger')
const { createHttpLogger } = require('./http-logger')
const { isVendorLoggerValid } = require('./utils')
const { createMessageBuilder } = require('./message-builder')

const escriba = config => {
  const { service, loggerEngine, sensitive, httpConf } = config
  if (!isVendorLoggerValid(loggerEngine)) {
    throw new Error('You must pass a valid logger library. We accept log4js and winston libraries.')
  }

  const messageMasker = ironMask.create(sensitive)
  const messageBuilder = createMessageBuilder(messageMasker, service)
  const logger = createLogger(loggerEngine, messageBuilder)
  const httpLogger = createHttpLogger(loggerEngine, messageBuilder, httpConf || {})
  return { logger, httpLogger }
}

module.exports = escriba
