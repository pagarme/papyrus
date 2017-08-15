const R = require('ramda')
const cuid = require('cuid')
const { createResponseLogger } = require('./response-logger')
const { createRequestLogger } = require('./request-logger')

const prepareConfigProps = ({ envToLog, propsToLog, skipRules }) => {
  const defaultPropsToLog = R.defaultTo({}, propsToLog)
  const defaultSkipRules = R.defaultTo({}, skipRules)
  const defaultEnvToLog = R.defaultTo([], envToLog)

  const skipRulesDefault = {
    bannedRoutes: R.defaultTo([], defaultSkipRules.bannedRoutes),
    bannedMethods: R.defaultTo([], defaultSkipRules.bannedMethods),
    bannedBodyRoutes: R.defaultTo([], defaultSkipRules.bannedBodyRoutes)
  }

  const propsToLogConfig = {
    request: R.concat(
      R.defaultTo(['id', 'body'], defaultPropsToLog.request),
      defaultEnvToLog
    ),
    response: R.concat(
      R.defaultTo(['id', 'body', 'statusCode'], defaultPropsToLog.response),
      defaultEnvToLog
    )
  }

  return { propsToLog: propsToLogConfig, skipRules: skipRulesDefault }
}

const shouldSkipLog = (url, method, rules) => {
  const bannedRoutesResult = R.contains(true, rules.bannedRoutes.map(regex => R.test(regex, url)))
  const bannedMethodsResult = rules.bannedMethods.includes(method)
  if (bannedRoutesResult || bannedMethodsResult) return true
  return false
}

const middleware = (requestLogger, responseLogger, skipRules) => (req, res, next) => {
  if (shouldSkipLog(req.url, req.method, skipRules)) return next()
  req.id = req.id || cuid()
  requestLogger(req)
  responseLogger(req, res)
  next()
}

const httpLogger = (logger, messageBuilder, config) => {
  const { propsToLog, skipRules } = prepareConfigProps(config)
  const { bannedBodyRoutes } = skipRules
  const { request, response } = propsToLog
  const reqLogger = createRequestLogger(logger, messageBuilder, request)
  const resLogger = createResponseLogger(logger, messageBuilder, response, bannedBodyRoutes)
  return middleware(reqLogger, resLogger, skipRules)
}

module.exports = { createHttpLogger: httpLogger }
