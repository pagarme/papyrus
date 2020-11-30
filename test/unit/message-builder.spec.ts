import { clone } from 'ramda'
import { createMessageBuilder } from '../../src/message-builder'

const messageBuilder = createMessageBuilder(clone, 'test')

test('messageBuilder: create message with a valid JSON object', () => {
  const { message, service, level } = messageBuilder({
    message: 'Papyrus',
    level: 'info'
  })

  expect(message).toBe('Papyrus')
  expect(service).toBe('test')
  expect(level).toBe('info')
})

test('messageBuilder: create message with a valid JSON object and custom service', () => {
  const { message, service, level } = messageBuilder({
    message: 'Papyrus',
    level: 'info',
    service: 'custom-test'
  })

  expect(message).toBe('Papyrus')
  expect(service).toBe('custom-test')
  expect(level).toBe('info')
})
