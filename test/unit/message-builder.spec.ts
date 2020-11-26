import { createMessageBuilder } from '../../src/message-builder'

let messageBuilder: any = {}

beforeEach(() => {
  const mockedMessageMasker = (object: any): any => object
  messageBuilder = createMessageBuilder(mockedMessageMasker, 'test')
})

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
