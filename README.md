# Papyrus - Logging with steroids

Papyrus provides a set of facilities for log information. 

# Why use Papyrus

- Attach an unique id for your logs, req and res will have the same id. Tip: use the same id across microservices.
- Hide secret information.
- Add extra information to your logs as pid, hostname, level, startTime, latency.
- Pick information from request and response.
- Add skip rules to bane routes, bodies and methods.

## Installation

```sh
npm install --save papyrus
```

## Usage

```js
const log4js = require('log4js').getLogger()
const papyrus = require('papyrus')

const papyrusConfig = {
  service: 'api',
  vendorLogger: log4js, // it's possible to use a winston instance
  sensitive: {
    password: {
      paths: ['message.password'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  },
  loggersMiddleware: {
    http: {
      propsToLog: {
        request: ['id', 'method', 'url', 'body', 'httpVersion', 'referrer', 'user-agent'],
        response: ['id', 'method', 'url', 'statusCode', 'body', 'httpVersion', 'referrer', 'user-agent', 'latency']
      },
      skipRules: {
        bannedRoutes: [/\/status.*/],
        bannedMethods: ['OPTIONS'],
        bannedBodyRoutes: [/\/status.*/, /.*\.(csv|xlsx)$/]  
      }
    }
  }
}

const { logger, middlewareLogger } = Papyrus(papyrusConfig)

logger.info({ text: 'password must be hidden', password: 'papyrus' }, { from: 'first log' })
```

The second parameter(from) is optional. With this configuration your log message will be something like:

```js
{
  id: 'cj13tgoeg0000l3set0x9drgk',
  message: {
    text: 'password must be hidden',
    password: '*'
  },
  from: 'first log',
  startTime: 1491837862420,
  service: 'api',
  level: 'info',
  pid: 39127,
  hostname: 'Papyrus-MacBook-Air.local'
}

```

As you can see we set a middleware property in papyrusConf, this information will be used on Express middleware:

```js
app.use(middlewareLogger.http)
```

Every request and response will be logged, and the most cool part: both will have the same id. This is important because you can search for this id and get all information about your request and response.

This id is injected in req object, then if you need to log some extra information between a request and response just do something like:

```js
logger.info('some controller information', { id: req.id })
```
