const R = require('ramda')
const cuid = require('cuid')
const { createResponseLogger } = require('./response-logger')
const { createRequestLogger } = require('./request-logger')
const { createSkipper } = require('./skipper')

const prepareConfigProps = ({ envToLog, propsToLog, skipRules, logIdPath }) => {
  const defaultPropsToLog = R.defaultTo({}, propsToLog)
  const defaultSkipRules = R.defaultTo([], skipRules)
  const defaultEnvToLog = R.defaultTo([], envToLog)
  const defaultLogIdPath = R.defaultTo('', logIdPath)

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

  return {
    propsToLog: propsToLogConfig,
    skipRules: defaultSkipRules,
    logIdPath: defaultLogIdPath
  }
}

const middleware = (requestLogger, responseLogger, logIdPath, skipper) => (req, res, next) => {
  if (skipper(req.url, req.method)) return next()
  req.id = R.path(R.split('.', logIdPath), req) || cuid()
  requestLogger(req)
  responseLogger(req, res)
  next()
}

const httpLogger = (logger, messageBuilder, config) => {
  const { propsToLog, skipRules, logIdPath } = prepareConfigProps(config)
  const { request, response } = propsToLog
  const skipper = createSkipper(skipRules)
  const reqLogger = createRequestLogger(logger, messageBuilder, request)
  const resLogger = createResponseLogger(logger, messageBuilder, response, skipper)
  return middleware(reqLogger, resLogger, logIdPath, skipper)
}

module.exports = { createHttpLogger: httpLogger }
