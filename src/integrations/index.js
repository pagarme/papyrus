const {
  __,
  filter,
  keys,
  pipe,
  propEq
} = require('ramda')

const getEnabledIntegrations = pipe(
  keys,
  filter(propEq(__, true))
)

const integrationHandlers = {}

module.exports.loadIntegrations = (integrations = {}) => {
  getEnabledIntegrations(integrations)
    .forEach((integration) => {
      try {
        integrationHandlers[integration] = require(`./${integration}`)
      } catch (e) {
        throw new Error(`Integration '${integration}' isn't supported by escriba lib yet`)
      }
    })
}

module.exports.log = (log, integrations = {}) => {
  const enabledIntegrations = getEnabledIntegrations(integrations)

  return enabledIntegrations.reduce((current, integration) => {
    const handler = integrationHandlers[integration]

    if (!handler) {
      throw new Error(`Invalid integration '${integration}'`)
    }

    return handler(current)
  }, log)
}
