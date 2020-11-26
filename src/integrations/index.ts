import {
  filter,
  keys,
  pipe,
  propEq, __
} from 'ramda'

const getEnabledIntegrations = pipe(
  keys,
  filter(propEq(__ as any, true) as any)
)

const integrationHandlers = {} as any

export const loadIntegrations = (integrations = {}) => {
  getEnabledIntegrations(integrations)
    .forEach((integration) => {
      try {
        integrationHandlers[integration] = require(`./${integration}`)
      } catch (e) {
        throw new Error(`Integration '${integration}' isn't supported by escriba lib yet`)
      }
    })
}

export const log = (log: any, integrations = {}) => {
  const enabledIntegrations = getEnabledIntegrations(integrations)

  return enabledIntegrations.reduce((current, integration) => {
    const handler = integrationHandlers[integration]

    if (!handler) {
      throw new Error(`Invalid integration '${integration}'`)
    }

    return handler(current)
  }, log)
}
