import { isMaskJsonVendor } from '@escriba/utils'

export const createMask = (mask: any, sensitive: any) => {
  if (isMaskJsonVendor(mask)) {
    const { blacklist, options } = sensitive
    return mask(blacklist, options)
  }

  return mask.create(sensitive)
}
