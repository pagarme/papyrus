const R = require('ramda')
const { pickProperties, stringify } = require('./utils')
const { filterLargeProp, filterLargeUrl } = require('./utils')

const buildRequestLog = (propsToLog, propMaxLength = {}) => req => {
  const reqProps = pickProperties(req, propsToLog)
  reqProps.body = filterLargeProp(reqProps.body, propMaxLength.body)
  reqProps.url = filterLargeUrl(reqProps.url, propMaxLength.url)
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
  propMaxLength
}) => (req) => {
  const log = R.pipe(buildRequestLog(propsToLog, propMaxLength), messageBuilder)(req)
  req.startTime = log.startTime
  logger.info(stringify(log))
  return log
}

module.exports = { createRequestLogger: requestLogger }
