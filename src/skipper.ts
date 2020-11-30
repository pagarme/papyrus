import { flip, reduce, test } from 'ramda'
import { HTTPMethods, SkipperRule } from './types'

const checkRuleBy = (property: any) => flip(test)(property)

export const createSkipper = (rules: SkipperRule[]) => (reqRoute: string, reqMethod: HTTPMethods, shouldSkipOnlyBody = false) => {
  const checkMethod = checkRuleBy(reqMethod)
  const checkRoute = checkRuleBy(reqRoute)

  const checkRules = (route: string, method: string) => (
    checkRoute(route) && checkMethod(method)
  )

  const decision = reduce(({ shouldSkip, onlyBody }, rule: any) => ({
    shouldSkip: checkRules(rule.route, rule.method) || shouldSkip,
    onlyBody: (checkRules(rule.route, rule.method) && rule.onlyBody) || onlyBody
  }), { shouldSkip: false, onlyBody: false }, rules)

  if (shouldSkipOnlyBody) {
    return decision.shouldSkip && decision.onlyBody
  }
  return decision.shouldSkip && !decision.onlyBody
}
