const R = require('ramda')
const { parseStringToJSON, pickProperties, generateLogLevel, stringify } = require('./utils')

const shouldSkipBody = (bannedBodyRoutes, url) => (
  R.contains(true, bannedBodyRoutes.map(regex => R.test(regex, url)))
)

const buildResLog = ({bannedBodyRoutes, propsToLog}) => ({ req, res }) => {
  const level = generateLogLevel(res.statusCode)
  if (shouldSkipBody(bannedBodyRoutes, req.url)) res.body = {}
  const reqProps = R.merge(pickProperties(req, propsToLog), pickProperties(req.headers, propsToLog))
  const resProps = pickProperties(res, propsToLog)
  return R.mergeAll([reqProps, resProps, { level, from: 'response' }])
}

const loggerByStatusCode = logger => message => {
  logger[message.level](stringify(message))
  return message
}

const prepareResLog = (req, res, buffer) => (
  parseStringToJSON(buffer.toString())
    .then(body => ({
      req,
      res: R.merge(res, { body })
    }))
)

const addLatency = (req, propsToLog) => message => {
  if (!R.contains('latency', propsToLog)) return message
  return R.merge(message, { latency: message.startTime - req.startTime })
}

const captureLog = (http, config, logger, messageBuilder) => {
  const { req, res } = http
  const { write, end } = res
  const chunks = []

  res.write = chunk => {
    chunks.push(Buffer.from(chunk))
    write.call(res, chunk)
  }

  res.end = chunk => {
    if (chunk) chunks.push(Buffer.from(chunk))

    prepareResLog(req, res, Buffer.concat(chunks))
      .then(buildResLog(config))
      .then(messageBuilder)
      .then(addLatency(req, config.propsToLog))
      .then(loggerByStatusCode(logger))

    end.call(res, chunk)
  }

  return res
}

const responseLogger = (logger, messageBuilder, propsToLog, bannedBodyRoutes) => (req, res) => {
  const config = { propsToLog, bannedBodyRoutes }
  const http = { req, res }
  return captureLog(http, config, logger, messageBuilder)
}

module.exports = { createResponseLogger: responseLogger }
