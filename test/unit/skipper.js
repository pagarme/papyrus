const { forEach, filter } = require('ramda')
const test = require('ava')
const { createSkipper } = require('../../src/skipper')

const methods = [
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

test('SkipByMethod: Skip all methods for /room route and its children', t => {
  const rules = [{
    route: /\/room/,
    method: /.*/,
    onlyBody: false
  }]

  const skipper = createSkipper(rules)

  forEach(method => (
    t.true(skipper('/room', method))
  ), methods)
})

test('SkipByMethod: Skip only GET method for /room route and its children', t => {
  const rules = [{
    route: /\/room/,
    method: /GET/,
    onlyBody: false
  }]

  const skipper = createSkipper(rules)
  const methodsWithoutGet = filter(method => method !== 'GET', methods)

  t.true(skipper('/room', 'GET'))
  t.true(skipper('/room/1', 'GET'))

  forEach(method => {
    t.false(skipper('/room', method))
    t.false(skipper('/room/1', method))
  }, methodsWithoutGet)
})

test('SkipByMethod: Skip only POST method for /room route and its children with multiples rules', t => {
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
    },
  ]

  const skipper = createSkipper(rules)

  t.true(skipper('/room/1', 'POST'))
  t.true(skipper('/room/1/player', 'POST'))
  t.false(skipper('/room/1', 'GET'))
  t.false(skipper('/room/1/player', 'GET'))
})

test('SkipByMethod: Skip by method for /room route and its children with rules overwriting', t => {
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

  t.true(skipper('/room/1', 'POST'))
  t.false(skipper('/room/1/player', 'POST'))
})

test('SkipByRoute: Skip all methods for specific /room/:id route', t => {
  const rules = [{
    route: /\/room\/[0-9](?!\/.*)/,
    method: /.*/,
    onlyBody: false
  }]

  const skipper = createSkipper(rules)

  forEach(method => {
    t.false(skipper('/room', method))
    t.true(skipper('/room/1', method))
  }, methods)
})

test('SkipByRoute: Skip only GET method for /player route and its children', t => {
  const rules = [{
    route: /\/player/,
    method: /GET/,
    onlyBody: false
  }]

  const skipper = createSkipper(rules)
  const methodsWithoutGet = filter(method => method !== 'GET', methods)

  t.true(skipper('/player', 'GET'))
  t.true(skipper('/player/1', 'GET'))

  forEach(method => {
    t.false(skipper('/player', method))
    t.false(skipper('/player/1', method))
  }, methodsWithoutGet)
})

test('EmptySkipRule: Do not skip any log', t => {
  const rules = []

  const skipper = createSkipper(rules)

  forEach(method => (
    t.false(skipper('/room', method))
  ), methods)
})
