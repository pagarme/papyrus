import { flip, reduce, test } from 'ramda'

const checkRuleBy = (property: any) => flip(test)(property)

export const createSkipper = (rules: any) => (reqRoute: any, reqMethod: any, shouldSkipOnlyBody = false) => {
  const checkMethod = checkRuleBy(reqMethod)
  const checkRoute = checkRuleBy(reqRoute)

  const checkRules = (route: any, method: any) => (
    checkRoute(route) && checkMethod(method)
  )

  const decision = reduce(({ shouldSkip, onlyBody }: any, rule: any) => ({
    shouldSkip: checkRules(rule.route, rule.method) || shouldSkip,
    onlyBody: (checkRules(rule.route, rule.method) && rule.onlyBody) || onlyBody
  }), { shouldSkip: false, onlyBody: false }, rules)

  if (shouldSkipOnlyBody) return decision.shouldSkip && decision.onlyBody
  return decision.shouldSkip && !decision.onlyBody
}
