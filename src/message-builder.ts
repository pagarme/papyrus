import { log as applyIntegrations } from '@escriba/integrations'
import moment from 'moment-timezone'
import os from 'os'
import R from 'ramda'
import { Integrations } from './types'

export type MessageLevel = 'debug' | 'error' | 'info' | 'warn'

export type Message = {
  message?: string
  level?: MessageLevel
  service?: string
}

const generateDefaultProps = (service: string, integrations?: Integrations) => applyIntegrations({
  service,
  startTime: moment().valueOf(),
  hostname: os.hostname(),
  pid: process.pid
}, integrations)

const filterMessage = <T>(source: R.Dictionary<T>) => R.filter<T>(prop => !R.isNil(prop), source)

export const createMessageBuilder = (messageMasker: (...args: any[]) => any, service: string, integrations?: Integrations) => (message: Message): Message => (
  filterMessage(messageMasker(R.merge(generateDefaultProps(service, integrations), message)))
)
