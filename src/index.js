const { createLogger } = require('./logger')
const { isVendorLoggerValid } = require('./utils')
const { createMessageMasker } = require('./message-masker')
const { createMessageBuilder } = require('./message-builder')
const { createMiddlewareLogger } = require('./middleware-logger')

const scribe = (config) => {
  const { service, vendorLogger, sensitive, loggersMiddleware } = config
  if (!isVendorLoggerValid(vendorLogger)) {
    throw new Error('You must pass a valid logger library. We accept log4js and winston libraries.')
  }
  const messageMasker = createMessageMasker(sensitive)
  const messageBuilder = createMessageBuilder(messageMasker, service)

  const logger = createLogger(vendorLogger, messageBuilder)
  const middlewareLogger = createMiddlewareLogger(vendorLogger, messageBuilder, loggersMiddleware)
  return { logger, middlewareLogger }
}

module.exports = scribe
