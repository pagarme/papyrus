const R = require('ramda')
const { pickProperties, stringify } = require('./utils')
const {
  filterLargeProp,
  filterLargeUrl,
  parsePropsType
} = require('./utils')

const buildRequestLog = (
  propsToLog,
  propMaxLength = {},
  propsToParse = {}
) => req => {
  const reqProps = pickProperties(req, propsToLog)
  reqProps.body = filterLargeProp(reqProps.body, propMaxLength.body)
  reqProps.url = filterLargeUrl(reqProps.url, propMaxLength.url)
  const env = pickProperties(process.env, propsToLog)
  const headerProps = pickProperties(req.headers, propsToLog)
  const reqParsedProps = parsePropsType(reqProps, propsToParse.request)
  return R.mergeAll([
    reqParsedProps,
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
  propMaxLength,
  propsToParse
}) => (req) => {
  const log = R.pipe(buildRequestLog(propsToLog, propMaxLength, propsToParse), messageBuilder)(req)
  req.startTime = log.startTime
  logger.info(stringify(log))
  return log
}

module.exports = { createRequestLogger: requestLogger }
