import {
  filter,
  keys,
  pipe,
  propEq,
  __
} from 'ramda'
import { IntegrationHandlers, Integrations } from '../types'

const getEnabledIntegrations = pipe(
  keys,
  filter(propEq(__ as any, true) as any) // TODO: improve types removing 'any'
)

const integrationHandlers: IntegrationHandlers = {}

export const loadIntegrations = (integrations: Integrations = {}) => {
  getEnabledIntegrations(integrations)
    .forEach((integration) => {
      try {
        integrationHandlers[integration] = require(`./${integration}`)
      } catch (e) {
        throw new Error(`Integration '${integration}' isn't supported by escriba lib yet`)
      }
    })
}

export const log = (log: any, integrations: Integrations = {}) => {
  const enabledIntegrations = getEnabledIntegrations(integrations)

  return enabledIntegrations.reduce((current, integration) => {
    const handler = integrationHandlers[integration]

    if (!handler) {
      throw new Error(`Invalid integration '${integration}'`)
    }

    return handler(current)
  }, log)
}
