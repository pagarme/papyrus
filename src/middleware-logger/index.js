const R = require('ramda')
const { createResponseLogger } = require('./response-logger')
const { createRequestLogger } = require('./request-logger')
const { createHttpLogger } = require('./http-logger')

const setDefaultProps = ({ propsToLog, skipRules }) => {
  const defaultPropsToLog = R.defaultTo({}, propsToLog)
  const defaultSkipRules = R.defaultTo({}, skipRules)

  const skipRulesDefault = {
    bannedRoutes: R.defaultTo([], defaultSkipRules.bannedRoutes),
    bannedMethods: R.defaultTo([], defaultSkipRules.bannedMethods),
    bannedBodyRoutes: R.defaultTo([], defaultSkipRules.bannedBodyRoutes)
  }

  const propsToLogConfig = {
    request: R.defaultTo(['id', 'body'], defaultPropsToLog.request),
    response: R.defaultTo(['id', 'body', 'statusCode'], defaultPropsToLog.response)
  }

  return { propsToLog: propsToLogConfig, skipRules: skipRulesDefault }
}

const prepareHttpLogger = (logger, messageBuilder, config) => {
  const { propsToLog, skipRules } = setDefaultProps(config)
  const { bannedBodyRoutes } = skipRules
  const { request, response } = propsToLog
  const reqLogger = createRequestLogger(logger, messageBuilder, request)
  const resLogger = createResponseLogger(logger, messageBuilder, response, bannedBodyRoutes)
  return createHttpLogger(reqLogger, resLogger, skipRules)
}

const middlewareLogger = (logger, messageBuilder, config) => (
  { http: prepareHttpLogger(logger, messageBuilder, config.http) }
)

module.exports = { createMiddlewareLogger: middlewareLogger }
