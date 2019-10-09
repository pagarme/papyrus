const R = require('ramda')
const test = require('ava')
const { createMessageBuilder } = require('../../src/message-builder')

let messageBuilder = {}

test.before(() => {
  const mockedMessageMasker = object => object
  messageBuilder = createMessageBuilder(mockedMessageMasker, 'test')
})

test('messageBuilder: create message with a valid JSON object', t => {
  const { message, service, level } = messageBuilder({ message: 'Papyrus', level: 'info' })
  t.is(message, 'Papyrus')
  t.is(service, 'test')
  t.is(level, 'info')
})
