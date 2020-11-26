import { stringify } from '@escriba/utils'
import cuid from 'cuid'
import R from 'ramda'

const buildLog = (messageBuilder: any) => (message: any, level: any, additional: any) => {
  const defaultAdditional = R.defaultTo({}, additional)
  const log = messageBuilder(Object.assign(
    { id: cuid(), message, level }, defaultAdditional
  ))
  return log
}

const createProxyLevels = (buildLog: any, logger: any) => {
  const levels = ['trace', 'fatal', 'debug', 'error', 'warn', 'info']
  return levels.map(lvl => ({
    [lvl]: (msg: any, additional: any) => (
      logger[lvl](stringify(buildLog(msg, lvl, additional)))
    )
  }))
}

export const createLogger = (vendorLogger: any, messageBuilder: any) => (
  Object.assign({}, ...createProxyLevels(buildLog(messageBuilder), vendorLogger))
)
