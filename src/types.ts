export type Map<T> = {
  [key: string]: T
}

export type Integrations = Map<any>

export type IntegrationHandlers = Map<(...args: any[]) => any>

export type HTTPMethods = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'

export type SkipperRule = {
  route: string | RegExp
  method: string | RegExp
  onlyBody: boolean
}

export type ParseFunction = Function | FunctionConstructor

export type PropMaxLengthType = Map<number>
export type PropsToParseType = {
  request?: Map<ParseFunction>
  response?: Map<ParseFunction>
}

export type EscribaHttpConfig = {
  envToLog?: string[]
  propsToLog?: {
    request?: string[]
    response?: string[]
  }
  skipRules?: SkipperRule[]
  logIdPath?: string
  propMaxLength?: PropMaxLengthType
  propsToParse?: PropsToParseType
}

export type CreateRequestLoggerParam = {
  logger: any
  messageBuilder: any
  request: string[]
  propMaxLength?: PropMaxLengthType
  propsToParse?: PropsToParseType
}

export type SensitiveMap = {
  [key: string]: {
    paths: string[]
    pattern: string | RegExp
    replacer: ((...args: any[]) => string) | string
  }
}

export type EscribaConfig = {
  service: string
  loggerEngine: any
  sensitive: SensitiveMap
  httpConf: EscribaHttpConfig
  maskEngine: any
  integrations: Integrations
}
