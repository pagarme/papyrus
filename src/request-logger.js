const R = require('ramda')
const { pickProperties, stringify } = require('./utils')
const { filterLargeProp } = require('./utils')

const buildRequestLog = (propsToLog, propLengthLimit) => req => {
  const reqProps = pickProperties(req, propsToLog)
  reqProps.body = filterLargeProp(reqProps, 'body', propLengthLimit)
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
  request: propsToLog,
  propLengthLimit
}) => (req) => {
  const log = R.pipe(buildRequestLog(propsToLog, propLengthLimit), messageBuilder)(req)
  req.startTime = log.startTime
  logger.info(stringify(log))
  return log
}

module.exports = { createRequestLogger: requestLogger }
