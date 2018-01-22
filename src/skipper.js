const { flip, test, reduce } = require('ramda')

const checkRuleBy = property => flip(test)(property)

const skipper = rules => (reqRoute, reqMethod, shouldSkipOnlyBody = false) => {
  const checkMethod = checkRuleBy(reqMethod)
  const checkRoute = checkRuleBy(reqRoute)

  const checkRules = (route, method) => (
    checkRoute(route) && checkMethod(method)
  )

  const decision = reduce(({ shouldSkip, onlyBody }, rule) => ({
    shouldSkip: checkRules(rule.route, rule.method) || shouldSkip,
    onlyBody: checkRules(rule.route, rule.method) && rule.onlyBody || onlyBody
  }), { shouldSkip: false, onlyBody: false }, rules)

  if (shouldSkipOnlyBody) return decision.shouldSkip && decision.onlyBody
  return decision.shouldSkip && !decision.onlyBody
}

module.exports = { createSkipper: skipper }
