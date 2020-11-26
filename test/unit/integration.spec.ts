import {
  loadIntegrations,
  log as applyIntegrations
} from '../../src/integrations'

test('datadog integration: when a function runs before its loaded', () => {
  const log = {
    name: 'escriba',
    service: 'api',
    level: 'debug'
  }

  const testFunction = () => applyIntegrations(log, {
    datadog: true
  })

  expect(testFunction).toThrowError(Error)
  expect(testFunction).toThrowError("Invalid integration 'datadog'")
})

test('integrations: when trying to load invalid integration', () => {
  const testFunction = () => loadIntegrations({
    invalid: true
  })

  expect(testFunction).toThrowError(Error)
  expect(testFunction).toThrowError("Integration 'invalid' isn't supported by escriba lib yet")
})
