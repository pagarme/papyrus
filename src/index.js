const { createLogger } = require('./logger')
const { createHttpLogger } = require('./http-logger')
const { isVendorLoggerValid } = require('./utils')
const { createMessageMasker } = require('./message-masker')
const { createMessageBuilder } = require('./message-builder')

const scribe = (config) => {
  const { service, vendorLogger, sensitive, httpConf } = config
  if (!isVendorLoggerValid(vendorLogger)) {
    throw new Error('You must pass a valid logger library. We accept log4js and winston libraries.')
  }

  const messageMasker = createMessageMasker(sensitive)
  const messageBuilder = createMessageBuilder(messageMasker, service)
  const logger = createLogger(vendorLogger, messageBuilder)
  const httpLogger = createHttpLogger(vendorLogger, messageBuilder, httpConf)
  return { logger, httpLogger }
}

module.exports = scribe
