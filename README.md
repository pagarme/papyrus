[![Coverage Status](https://coveralls.io/repos/github/pagarme/escriba/badge.svg?branch=feature%2Fadd-coverage)](https://coveralls.io/github/pagarme/escriba?branch=feature%2Fadd-coverage)
[![Build Status](https://travis-ci.org/pagarme/escriba.svg?branch=master)](https://travis-ci.org/pagarme/escriba)
![Escriba Logo](https://image.ibb.co/jHdFD5/escriba.png)

> Logging on steroids

# Escriba

The motivations for this library is to provide ways for a better express application logging. To achieve this goal we provide tools to managing logs, a log tracker across services and we add relevant information to your log.

# Cool features

- JSON format
- Unique id
- Request and responses share the same id. This enables tracking the path of a request across your services
- Hide secret information based on regex
- Adds extra information to your logs as `pid`, `hostname`, `level`, `startTime`, and `latency`
- Filter props from request and/or response
- Skip routes based on methods/rules/body props

# Installation

```sh
npm install --save escriba
```

# Usage

Escriba provides two kinds of logger: `logger` and `httpLogger`.

## Logger

Use `logger` log across your application.

For example, to log some information from an `userController` hidding the password property:

```js
const log4js = require('log4js').getLogger()
const escriba = require('escriba')
const cuid = require('cuid')

log4js.level = 'info'

const { logger } = escriba({ 
  loggerEngine: log4js, 
  service: 'api',
  sensitive: {
    password: {
      paths: ['message.password'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  }
})

logger.info({ text: 'Setting user permission', password: 'abc' }, { id: cuid(), from: 'userController' })
```

## Http logger

Use `httpLogger` to log an http request and response.

For this example we'll long only some properties: `id`, `body` and `statusCode`. 

We'll also skip status route, options method and body property from routes that end with .csv or .xlsx.

It's important to hide sentive information like api_key. 

```js
const express = require('express')
const log4js = require('log4js').getLogger()
const escriba = require('escriba')
const cuid = require('cuid')
const roomController = require('./controllers/room')

const app = express()

const { httpLogger } = escriba({ 
  loggerEngine: log4js, 
  sensitive: {
    password: {
      paths: ['body.api_key'],
      pattern: /(ak_test|ak_live).*/g,
      replacer: '*'
    }
  },
  httpConf: {
    propsToLog: {
      request: ['id', 'url', 'body'],
      response: ['id', 'url', 'body', 'statusCode', 'latency']
    },
    envToLog: ['SHELL', 'PATH'],
    skipRules: {
      bannedRoutes: [/\/status.*/],
      bannedMethods: ['OPTIONS'],
      bannedBodyRoutes: [/.*\.(csv|xlsx)$/]  
    }
  }
})

app.use(httpLogger)

app.get('/room/:id', roomController.index)
app.post('/room', roomController.save)
```

Every request and response will be logged, and the coolest part: both will have the same id. This is important because you can search for this id and get all information about your request and response.

This id is injected in the `req` object, so if you need to log some extra information between a request and response just do something like this:

```js
logger.info('some controller information', { id: req.id })
```

## Examples

The `log-generator` inside `examples` folder will run a Node.js application that will make a request for itself every in an interval defined by the user (in milliseconds). The application will get input values from an environment variable `ESCRIBA_TIMEOUT`(3000 is the default value, this represents 3 seconds)

To use `log-generator` through Docker use these commands inside the `log-generator` folder:

```
docker build -t pagarme/log-generator:latest .

docker run -e ESCRIBA_TIMEOUT=3000 -p 3000:3000 -d -v $(cd ../../ && pwd):/log-generator/node_modules/escriba pagarme/log-generator:latest

```

And to make some manual requests use:

```
curl -H "Content-Type: application/json" -X GET http://localhost:3000/escriba

curl -H "Content-Type: application/json" -X POST -d '{"username":"a name"}' http://localhost:3000/escriba
```

The `log-generator` example will get Escriba library from npm. If you want to get the library directly from the repository run docker with `-v`:

```
docker run -e ESCRIBA_TIMEOUT=3000 -p 3000:3000 -d -v $(cd ../../ && pwd):/escriba pagarme/log-generator:latest
```

## License

```
The MIT License (MIT)
Copyright (c) 2017 Pagar.me Pagamentos S/A
```
