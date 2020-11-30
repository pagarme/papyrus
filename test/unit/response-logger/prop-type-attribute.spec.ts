import { buildResLog } from '../../../src/response-logger'

let buildLogResult: any = {}

const propsToLog = [
  'id',
  'method',
  'url',
  'body',
  'user-agent',
  'env'
]

const propsToParse = {
  response: {
    'body.foo': String,
    id: parseInt
  }
}

buildLogResult = buildResLog(propsToLog, {}, propsToParse)

test('should return parsed body content', () => {
  const expectedResponse = {
    id: 123,
    body: {
      foo: '42'
    },
    method: 'POST',
    from: 'response',
    env: {},
    level: 'info',
    url: undefined
  }

  const req = {
  }

  const res = {
    id: 123,
    body: {
      foo: 42
    },
    method: 'POST',
    from: 'response',
    env: {},
    level: 'info'
  }

  const response = buildLogResult({ req, res })

  expect(response).toEqual(expectedResponse)
})
