import { log as applyIntegrations } from '@escriba/integrations'
import moment from 'moment-timezone'
import os from 'os'
import R from 'ramda'

const generateDefaultProps = (service: any, integrations: any) => applyIntegrations({
  service,
  startTime: moment().valueOf(),
  hostname: os.hostname(),
  pid: process.pid
}, integrations)

const filterMessage = R.filter(prop => !R.isNil(prop))

export const createMessageBuilder = (messageMasker: any, service: any, integrations?: any) => (message: any) => (
  filterMessage(messageMasker(R.merge(generateDefaultProps(service, integrations), message)))
)
