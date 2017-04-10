const cuid = require('cuid')
const R = require('ramda')

const shouldSkipLog = (url, method, rules) => {
  const bannedRoutesResult = R.contains(true, rules.bannedRoutes.map(regex => R.test(regex, url)))
  const bannedMethodsResult = rules.bannedMethods.includes(method)
  if (bannedRoutesResult || bannedMethodsResult) return true
  return false
}

const httpLogger = (requestLogger, responseLogger, skipRules) => (req, res, next) => {
  if (shouldSkipLog(req.url, req.method, skipRules)) return next()
  req.id = req.id || cuid()
  requestLogger(req)
  responseLogger(req, res)
  next()
}

module.exports = { createHttpLogger: httpLogger }
