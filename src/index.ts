import { createHttpLogger } from './http-logger'
import { loadIntegrations } from './integrations'
import { createLogger } from './logger'
import { createMask } from './mask'
import { createMessageBuilder } from './message-builder'
import { EscribaConfig } from './types'
import { isVendorLoggerValid, isVendorMaskValid } from './utils'

const ironMask: any = require('iron-mask')

export const escriba = (config: EscribaConfig) => {
  const {
    service,
    loggerEngine,
    sensitive,
    httpConf,
    maskEngine,
    integrations
  } = config

  if (!isVendorLoggerValid(loggerEngine)) {
    throw new Error('You must pass a valid logger library. We accept log4js and winston libraries.')
  }

  const mask = maskEngine || ironMask

  if (!isVendorMaskValid(mask)) {
    throw new Error('You must pass a valid mask library. We accept iron-mask and mask-json libraries.')
  }

  loadIntegrations(integrations)

  const messageMasker = createMask(mask, sensitive)
  const messageBuilder = createMessageBuilder(messageMasker, service, integrations)
  const logger = createLogger(loggerEngine, messageBuilder)
  const httpLogger = createHttpLogger(loggerEngine, messageBuilder, httpConf || {})
  return { logger, httpLogger }
}

export default escriba

export { EscribaConfig, EscribaHttpConfig, HTTPMethods } from './types'
