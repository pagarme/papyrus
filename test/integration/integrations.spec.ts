import { loadIntegrations, log as applyIntegrations } from '../../src/integrations'

test('integrations: when no integration is enabled', () => {
  loadIntegrations()

  const log = {
    name: 'escriba',
    service: 'api',
    level: 'debug'
  }

  const logAfterIntegrations = applyIntegrations(log)

  expect(log).toEqual(logAfterIntegrations)
  expect(log === logAfterIntegrations).toBe(true)
})
