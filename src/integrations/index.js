const {
  __,
  filter,
  keys,
  pipe,
  propEq
} = require('ramda')
const datadog = require('./datadog')

const integrationHandlers = {
  datadog
}

module.exports = (log, integrations = {}) => {
  const getEnabledIntegrations = pipe(
    keys,
    filter(propEq(__, true, integrations))
  )

  const enabledIntegrations = getEnabledIntegrations(integrations)

  return enabledIntegrations.reduce((current, integration) => {
    const handler = integrationHandlers[integration]

    return handler(current)
  }, log)
}
