const os = require('os')
const R = require('ramda')
const moment = require('moment-timezone')

const generateDefaultProps = service => ({
  service,
  startTime: moment().valueOf(),
  hostname: os.hostname(),
  pid: process.pid
})

const filterMessage = R.filter(prop => !R.isNil(prop))

const builder = (messageMasker, service) => (message, propsToLog) => (
  filterMessage(messageMasker(R.merge(message, generateDefaultProps(service))))
)

const messageBuilder = (messageMasker, service) => (
  builder(messageMasker, service)
)

module.exports = { createMessageBuilder: messageBuilder }
