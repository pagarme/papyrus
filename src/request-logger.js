const R = require('ramda')
const { pickProperties, stringify } = require('./utils')
const { filterLargeBody } = require('./utils')

const buildRequestLog = (propsToLog, bodyLengthLimit) => req => {
  const reqProps = pickProperties(req, propsToLog)
  reqProps.body = filterLargeBody(reqProps.body, bodyLengthLimit)
  const env = pickProperties(process.env, propsToLog)
  const headerProps = pickProperties(req.headers, propsToLog)
  return R.mergeAll([
    reqProps,
    headerProps,
    {
      level: 'info',
      from: 'request',
      env
    }
  ])
}

const requestLogger = ({
  logger,
  messageBuilder,
  propsToLog,
  bodyLengthLimit
}) => (req) => {
  const log = R.pipe(buildRequestLog(propsToLog, bodyLengthLimit), messageBuilder)(req)
  req.startTime = log.startTime
  logger.info(stringify(log))
  return log
}

module.exports = { createRequestLogger: requestLogger }
