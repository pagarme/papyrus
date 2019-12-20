const test = require('ava')

const {
  loadIntegrations,
  log: applyIntegrations
} = require('../../src/integrations')

test('integrations: when no integration is enabled', t => {
  loadIntegrations()

  const log = {
    name: 'escriba',
    service: 'api',
    level: 'debug'
  }

  const logAfterIntegrations = applyIntegrations(log)

  t.deepEqual(log, logAfterIntegrations)
  t.is(log === logAfterIntegrations, true)
})
