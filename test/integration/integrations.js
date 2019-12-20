const test = require('ava')

const applyIntegrations = require('../../src/integrations')

test('integrations: when no integration is enabled', t => {
  const log = {
    name: 'escriba',
    service: 'api',
    level: 'debug'
  }

  const logAfterIntegrations = applyIntegrations(log)

  t.deepEqual(log, logAfterIntegrations)
})

test('datadog integration: when datadog function runs', t => {
  const log = {
    name: 'escriba',
    service: 'api',
    level: 'debug'
  }

  const logAfterIntegrations = applyIntegrations(log, {
    datadog: true
  })

  t.deepEqual(log, logAfterIntegrations)
  t.is(logAfterIntegrations === log, true)
})
