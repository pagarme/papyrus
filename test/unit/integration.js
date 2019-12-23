const test = require('ava')

const {
  loadIntegrations,
  log: applyIntegrations
} = require('../../src/integrations')

test('datadog integration: when a function runs before its loaded', t => {
  const log = {
    name: 'escriba',
    service: 'api',
    level: 'debug'
  }

  const testFunction = () => applyIntegrations(log, {
    datadog: true
  })

  t.throws(
    testFunction,
    Error,
    "Invalid integration 'datadog'"
  )
})

test('integrations: when trying to load invalid integration', t => {
  const testFunction = () => loadIntegrations({
    invalid: true
  })

  t.throws(
    testFunction,
    Error,
    "Integration 'invalid' isn't supported by escriba lib yet"
  )
})
