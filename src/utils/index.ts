import circularJSON from 'circular-json'
import R from 'ramda'
import { serializeError } from 'serialize-error'

const pokeprop: <T>(arr: string[], obj: T) => Partial<T> = require('pokeprop')

export const parseStringToJSON = (chunk: string) => (
  Promise.resolve(chunk)
    .then(JSON.parse)
    .catch(() => chunk)
)

export const stringify = (log: any) => {
  if (typeof log === 'string') return log
  if (R.is(Error, log.message)) log.message = serializeError(log.message)
  return circularJSON.stringify(log)
}

export const pickProperties = R.flip(pokeprop)

export const generateLogLevel = (statusCode: number): 'info' | 'warn' | 'error' => {
  if (statusCode < 400 || R.isNil(statusCode)) return 'info'
  if (statusCode < 500) return 'warn'
  return 'error'
}

export const isVendorLoggerValid = (vendor: any): boolean => {
  if (typeof vendor !== 'object') return false
  const levels = ['debug', 'error', 'warn', 'info']
  const validationResult = levels.map(level => R.is(Function, vendor[level]))
  return !R.contains(false, validationResult)
}

export const isIronMaskVendor = (vendor: any): boolean => {
  if (typeof vendor !== 'object') return false
  if (!R.is(Function, R.path(['create'], vendor))) return false
  if (!R.is(Function, vendor.create({}))) return false
  return true
}

export const isMaskJsonVendor = (vendor: any): boolean => {
  if (!R.is(Function, vendor)) return false
  if (!R.equals(vendor.length, 1)) return false
  const mask = vendor()
  if (!R.is(Function, mask)) return false
  if (!R.equals(mask.length, 1)) return false
  return true
}

export const isVendorMaskValid = (maskVendor: any): boolean =>
  isIronMaskVendor(maskVendor) || isMaskJsonVendor(maskVendor)

export const filterLargeProp = <T>(prop?: T, propLengthLimit?: number): {} | T | undefined => {
  if (!prop) return

  if (propLengthLimit === undefined) return prop

  const setDefaultProp = () => Array.isArray(prop) ? [] : {}

  return JSON.stringify(prop).length > propLengthLimit ? setDefaultProp() : prop
}

export const filterLargeUrl = (url?: string, urlLengthLimit?: number) => {
  if (!url) return

  if (urlLengthLimit === undefined) return url

  const truncateUrl = () => url.substring(0, urlLengthLimit - 3) + '...'

  return url.length > urlLengthLimit ? truncateUrl() : url
}

export const parsePropsType = (reqProps: { [key: string]: any }, propsType: { [key: string]: (...args: any[]) => any }) => {
  const propsTypeKeys = R.keys(propsType) as string[]

  if (propsTypeKeys.length === 0) {
    return reqProps
  }

  return propsTypeKeys.reduce((acc, key) => {
    const propPath = key.split('.')
    const reqProp = R.path(propPath, acc)

    if (reqProp !== undefined) {
      const propTypeFunction = propsType[key]
      return R.assocPath(propPath, propTypeFunction(reqProp), acc)
    }

    return acc
  }, reqProps)
}
