const R = require('ramda')
const test = require('ava')
const ironMask = require('iron-mask')

const { createMessageBuilder } = require('../../src/message-builder')

let messageBuilder = {}

test.before(() => {
  const sensitive = {
    password: {
      paths: ['message.password'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  }

  messageBuilder = createMessageBuilder(ironMask.create(sensitive), 'test')
})

test('messageBuilder: create a message with a masked message.password property', t => {
  const object = {
    message: {
      password: 'Papyrus'
    },
    level: 'info'
  }

  const { message, service, level } = messageBuilder(object)
  t.is(message.password, '*')
  t.is(service, 'test')
  t.is(level, 'info')
})
