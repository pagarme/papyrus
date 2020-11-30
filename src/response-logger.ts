import {
  filterLargeProp,
  filterLargeUrl,
  generateLogLevel,
  parsePropsType,
  parseStringToJSON,
  pickProperties,
  stringify
} from '@escriba/utils'
import R from 'ramda'

export const buildResLog = (
  propsToLog: string[],
  propMaxLength = {} as any,
  propsToParse = {} as any
) => ({ req, res }: { req: any; res: any }) => {
  const level = generateLogLevel(res.statusCode)

  const reqProps = R.merge(
    pickProperties(req, propsToLog),
    pickProperties(req.headers, propsToLog)
  )
  const env = pickProperties(process.env, propsToLog)

  const resProps = pickProperties(res, propsToLog)

  resProps.body = filterLargeProp(resProps.body, propMaxLength.body)
  reqProps.url = req.originalUrl || req.url
  reqProps.url = filterLargeUrl(reqProps.url, propMaxLength.url)

  const reqParsedProps = parsePropsType(reqProps, propsToParse.response)
  const resParsedProps = parsePropsType(resProps, propsToParse.response)
  const reqResProps = pickProperties(
    {
      req,
      res
    },
    propsToLog
  )

  return R.mergeAll([
    reqParsedProps,
    resParsedProps,
    reqResProps,
    {
      level,
      from: 'response',
      env
    }
  ])
}

const loggerByStatusCode = (logger: any) => (message: any) => {
  logger[message.level](stringify(message))
  return message
}

const prepareResLog = (req: any, res: any, buffer: any) => (
  parseStringToJSON(buffer.toString())
    .then(body => ({
      req,
      res: R.merge(res, { body })
    }))
)

const addLatency = (req: any, propsToLog: any) => (message: any) => {
  if (!R.contains('latency', propsToLog)) return message
  return R.merge(message, { latency: message.startTime - req.startTime })
}

const captureLog = ({
  http,
  propsToLog,
  skipper,
  logger,
  messageBuilder,
  propMaxLength,
  propsToParse
}: any) => {
  const { req, res } = http
  const { write, end } = res
  const chunks = [] as any[]
  const shouldSkipChunk = skipper(req.url, req.method, true)

  res.write = (chunk: any) => {
    if (!shouldSkipChunk) chunks.push(Buffer.from(chunk))
    write.call(res, chunk)
  }

  res.end = (chunk: any) => {
    if (chunk && !shouldSkipChunk) chunks.push(Buffer.from(chunk))
    prepareResLog(req, res, Buffer.concat(chunks))
      .then(buildResLog(propsToLog, propMaxLength, propsToParse))
      .then(messageBuilder)
      .then(addLatency(req, propsToLog))
      .then(loggerByStatusCode(logger))

    end.call(res, chunk)
  }

  return res
}

export const createResponseLogger = ({
  logger,
  messageBuilder,
  response: propsToLog,
  skipper,
  propMaxLength,
  propsToParse
}: any) => (req: any, res: any) => (
  captureLog({
    http: { req, res },
    propsToLog,
    skipper,
    logger,
    messageBuilder,
    propMaxLength,
    propsToParse
  })
)
