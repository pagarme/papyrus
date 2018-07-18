const { isMaskJsonVendor } = require('./utils')

const createMask = (mask, sensitive) => {
  if (isMaskJsonVendor(mask)) {
    const { blacklist, options } = sensitive
    return mask(blacklist, options)
  }

  return mask.create(sensitive)
}

module.exports = {
  createMask
}
