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

const convertBodyToObject = bodyValue => {
  if (!R.is(Object, bodyValue)) return { message: bodyValue }
  return bodyValue
}

const builder = (messageMasker, service) => (message, propsToLog) => {
  const messageToLog = R.merge(message, { body: convertBodyToObject(message.body) })
  return filterMessage(messageMasker(R.merge(messageToLog, generateDefaultProps(service))))
}

const messageBuilder = (messageMasker, service) => (
  builder(messageMasker, service)
)

module.exports = { createMessageBuilder: messageBuilder }
