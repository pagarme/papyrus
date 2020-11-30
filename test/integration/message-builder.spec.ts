import { createMessageBuilder } from '../../src/message-builder'

const ironMask = require('iron-mask')
let messageBuilder: any = {}

beforeEach(() => {
  const sensitive = {
    password: {
      paths: ['message.password'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  }

  messageBuilder = createMessageBuilder(ironMask.create(sensitive), 'test')
})

test('messageBuilder: create a message with a masked message.password property', () => {
  const object = {
    message: {
      password: 'Papyrus'
    },
    level: 'info'
  }

  const { message, service, level } = messageBuilder(object)
  expect(message.password).toBe('*')
  expect(service).toBe('test')
  expect(level).toBe('info')
})
