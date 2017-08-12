const R = require('ramda')
const { pickProperties, stringify } = require('./utils')

const buildRequestLog = propsToLog => req => {
  const reqProps = pickProperties(req, propsToLog)
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

const requestLogger = (logger, messageBuilder, propsToLog) => (req) => {
  const log = R.pipe(buildRequestLog(propsToLog), messageBuilder)(req)
  req.startTime = log.startTime
  logger.info(stringify(log))
  return log
}

module.exports = { createRequestLogger: requestLogger }
