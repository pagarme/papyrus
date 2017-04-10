const R = require('ramda')

const buildMaskStep = object => ({ path, pattern, replacer }) => {
  if (R.isEmpty(object)) return {}
  const splitedPath = R.split('.', path)
  let value = R.path(splitedPath, object)
  if (!R.isNil(value) && R.is(String, value)) value = value.replace(pattern, replacer)
  return { path: splitedPath, value }
}

const buildRegexList = sensitive => R.reduce((list, sensitive) => {
  const { paths, pattern, replacer } = R.last(sensitive)
  const regex = R.map(path => ({ root: R.split('.', path), path, pattern, replacer }), paths)
  return R.concat(list, regex)
}, [], sensitive)

const applyMaskSteps = (maskSteps, json) => {
  let maskedJson = R.clone(json)
  maskSteps.forEach(({path, value}) => {
    const lens = R.lensPath(path)
    if (!R.view(lens, maskedJson)) return {}
    maskedJson = R.set(lens, value, maskedJson)
  })

  return maskedJson
}

const maskObject = regexList => json => {
  const maskSteps = R.map(regex => buildMaskStep(R.pick(regex.root, json))(regex), regexList)
  const filteredMaskSteps = maskSteps.filter(step => !R.isEmpty(step))
  return applyMaskSteps(filteredMaskSteps, json)
}

const messageMasker = sensitive => (
  R.pipe(R.toPairs, buildRegexList, maskObject)(sensitive)
)

module.exports = { createMessageMasker: messageMasker }
