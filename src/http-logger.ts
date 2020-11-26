import cuid from 'cuid'
import R from 'ramda'
import { createRequestLogger } from './request-logger'
import { createResponseLogger } from './response-logger'
import { createSkipper } from './skipper'

const prepareConfigProps = ({
  envToLog,
  propsToLog,
  skipRules,
  logIdPath,
  propMaxLength,
  propsToParse
}: any) => {
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
    logIdPath: defaultLogIdPath,
    propMaxLength,
    propsToParse
  }
}

const middleware = (requestLogger: any, responseLogger: any, logIdPath: any, skipper: any) => (req: any, res: any, next: any) => {
  if (skipper(req.url, req.method)) return next()
  req.id = R.path(R.split('.', logIdPath), req) || cuid()
  requestLogger(req)
  responseLogger(req, res)
  next()
}

export const createHttpLogger = (logger: any, messageBuilder: any, config: any) => {
  const {
    propsToLog,
    skipRules,
    logIdPath,
    propMaxLength,
    propsToParse
  } = prepareConfigProps(config)
  const { request, response } = propsToLog
  const skipper = createSkipper(skipRules)
  const reqLogger = createRequestLogger({
    logger,
    messageBuilder,
    request,
    propMaxLength,
    propsToParse
  })
  const resLogger = createResponseLogger({
    logger,
    messageBuilder,
    response,
    skipper,
    propMaxLength,
    propsToParse
  })
  return middleware(reqLogger, resLogger, logIdPath, skipper)
}
