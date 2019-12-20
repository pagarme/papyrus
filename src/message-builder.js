const os = require('os')
const R = require('ramda')
const moment = require('moment-timezone')

const applyIntegrations = require('./integrations')

const generateDefaultProps = (service, integrations) => applyIntegrations({
  service,
  startTime: moment().valueOf(),
  hostname: os.hostname(),
  pid: process.pid
}, integrations)

const filterMessage = R.filter(prop => !R.isNil(prop))

const builder = (messageMasker, service, integrations) => (message, propsToLog) => (
  filterMessage(messageMasker(R.merge(message, generateDefaultProps(service, integrations))))
)

module.exports = { createMessageBuilder: builder }
