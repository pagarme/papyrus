const os = require('os')
const moment = require('moment-timezone')
const {
  __,
  assoc,
  complement,
  filter,
  isNil,
  merge,
  pipe
} = require('ramda')

const notNil = complement(isNil)

const defaultProps = {
  startTime: moment().valueOf(),
  hostname: os.hostname(),
  pid: process.pid
}

const createMessageBuilder = (messageMasker, service) => (message, propsToLog) =>
  pipe(
    assoc('service', __, defaultProps),
    merge(message),
    messageMasker,
    filter(notNil)
  )(service)

module.exports = { createMessageBuilder }
