import { filter, forEach } from 'ramda'
import { createSkipper } from '../../src/skipper'
import { HTTPMethods } from '../../src/types'

const methods: HTTPMethods[] = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'DELETE',
  'CONNECT',
  'OPTIONS',
  'TRACE',
  'PATCH'
]

test('SkipByMethod: Skip all methods for /room route and its children', () => {
  const rules = [{
    route: /\/room/,
    method: /.*/,
    onlyBody: false
  }]

  const skipper = createSkipper(rules)

  forEach(method => (
    expect(skipper('/room', method)).toBe(true)
  ), methods)
})

test('SkipByMethod: Skip only GET method for /room route and its children', () => {
  const rules = [{
    route: /\/room/,
    method: /GET/,
    onlyBody: false
  }]

  const skipper = createSkipper(rules)
  const methodsWithoutGet = filter(method => method !== 'GET', methods)

  expect(skipper('/room', 'GET')).toBe(true)
  expect(skipper('/room/1', 'GET')).toBe(true)

  forEach(method => {
    expect(skipper('/room', method)).toBe(false)
    expect(skipper('/room/1', method)).toBe(false)
  }, methodsWithoutGet)
})

test('SkipByMethod: Skip only GET method for /room route and only body', () => {
  const rules = [{
    route: /\/room/,
    method: /GET/,
    onlyBody: true
  }]

  const skipper = createSkipper(rules)
  const methodsWithoutGet = filter(method => method !== 'GET', methods)

  expect(skipper('/room', 'GET', true)).toBe(true)
  expect(skipper('/room/1', 'GET', true)).toBe(true)

  forEach(method => {
    expect(skipper('/room', method, true)).toBe(false)
    expect(skipper('/room/1', method, true)).toBe(false)
  }, methodsWithoutGet)
})

test('SkipByMethod: Skip only POST method for /room route and its children with multiples rules', () => {
  const rules = [
    {
      route: /\/room/,
      method: /POST/,
      onlyBody: false
    },
    {
      route: /\/game/,
      method: /GET/,
      onlyBody: false
    }
  ]

  const skipper = createSkipper(rules)

  expect(skipper('/room/1', 'POST')).toBe(true)
  expect(skipper('/room/1/player', 'POST')).toBe(true)
  expect(skipper('/room/1', 'GET')).toBe(false)
  expect(skipper('/room/1/player', 'GET')).toBe(false)
})

test('SkipByMethod: Skip by method for /room route and its children with rules overwriting', () => {
  const rules = [
    {
      route: /\/room/,
      method: /POST/,
      onlyBody: false
    },
    {
      route: /\/room/,
      method: /GET/,
      onlyBody: false
    },
    {
      route: /\/player/,
      method: /.*/,
      onlyBody: true
    }
  ]

  const skipper = createSkipper(rules)

  expect(skipper('/room/1', 'POST')).toBe(true)
  expect(skipper('/room/1/player', 'POST')).toBe(false)
})

test('SkipByRoute: Skip all methods for specific /room/:id route', () => {
  const rules = [{
    route: /\/room\/[0-9](?!\/.*)/,
    method: /.*/,
    onlyBody: false
  }]

  const skipper = createSkipper(rules)

  forEach(method => {
    expect(skipper('/room', method)).toBe(false)
    expect(skipper('/room/1', method)).toBe(true)
  }, methods)
})

test('SkipByRoute: Skip only GET method for /player route and its children', () => {
  const rules = [{
    route: /\/player/,
    method: /GET/,
    onlyBody: false
  }]

  const skipper = createSkipper(rules)
  const methodsWithoutGet = filter(method => method !== 'GET', methods)

  expect(skipper('/player', 'GET')).toBe(true)
  expect(skipper('/player/1', 'GET')).toBe(true)

  forEach(method => {
    expect(skipper('/player', method)).toBe(false)
    expect(skipper('/player/1', method)).toBe(false)
  }, methodsWithoutGet)
})

test('EmptySkipRule: Do not skip any log', () => {
  const rules: any[] = []

  const skipper: any = createSkipper(rules)

  forEach(method => (
    expect(skipper('/room', method)).toBe(false)
  ), methods)
})
