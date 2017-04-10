const { createLogger } = require('./logger')
const { isVendorLoggerValid } = require('./utils')
const { createMessageMasker } = require('./message-masker')
const { createMessageBuilder } = require('./message-builder')
const { createMiddlewareLogger } = require('./middleware-logger')

const scribe = (config) => {
  const { service, vendor, sensitive, middleware } = config
  if (!isVendorLoggerValid(vendor)) {
    throw new Error('You must pass a valid logger library. We accept log4js and winston libraries.')
  }
  const messageMasker = createMessageMasker(sensitive)
  const messageBuilder = createMessageBuilder(messageMasker, service)

  const logger = createLogger(vendor, messageBuilder)
  const middlewareLogger = createMiddlewareLogger(vendor, messageBuilder, middleware)
  return { logger, middlewareLogger }
}

module.exports = scribe
