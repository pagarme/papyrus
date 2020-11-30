import {
  filterLargeProp,
  filterLargeUrl,
  parsePropsType,
  pickProperties,
  stringify
} from '@escriba/utils'
import { Request } from 'express'
import R from 'ramda'
import { CreateRequestLoggerParam, PropMaxLengthType, PropsToParseType } from './types'

const buildRequestLog = (
  propsToLog: string[],
  propMaxLength = {} as PropMaxLengthType,
  propsToParse?: PropsToParseType
) => <P, Q, R, S>(req: Request<P, Q, R, S> & { body?: any }) => {
  const reqProps = pickProperties(req, propsToLog)
  reqProps.body = filterLargeProp(reqProps.body, propMaxLength.body)

  reqProps.url = req.originalUrl || req.url
  reqProps.url = filterLargeUrl(reqProps.url, propMaxLength.url)
  const env = pickProperties(process.env, propsToLog)
  const headerProps = pickProperties(req.headers, propsToLog)
  const reqParsedProps = parsePropsType(reqProps, propsToParse?.request || {})
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

export const createRequestLogger = ({
  logger,
  messageBuilder,
  request: propsToLog,
  propMaxLength,
  propsToParse
}: CreateRequestLoggerParam) => <P, Q, R, S>(req: Request<P, Q, R, S> & { startTime?: any }) => {
  const log: any = R.pipe(buildRequestLog(propsToLog, propMaxLength, propsToParse), messageBuilder)(req)
  req.startTime = log.startTime
  logger.info(stringify(log))
  return log
}
