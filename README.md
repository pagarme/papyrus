[![Coverage Status](https://coveralls.io/repos/github/pagarme/escriba/badge.svg?branch=feature%2Fadd-coverage)](https://coveralls.io/github/pagarme/escriba?branch=feature%2Fadd-coverage)
[![Build Status](https://travis-ci.org/pagarme/escriba.svg?branch=master)](https://travis-ci.org/pagarme/escriba)
![Escriba Logo](https://image.ibb.co/jHdFD5/escriba.png)

> Logging with steroids

# Escriba

The motivations for this library is to provide ways for a better express application logging. To achieve this goal we provide tools to managing logs, a log tracker across services and we add relevant information to your log.

# Cool features

- Your logs will have a unique id.
- Request and responses will have the same id. You can pass this id to another service, making possible to track the path of a request across your services.
- It's possible to hide secret information based on regex.
- Escriba use JSON format and adds extra information to your logs as pid, hostname, level, startTime, latency.
- You can tell to Escriba to log only some props from a request or response.
- If you have some routes that aren't important you can add rules to skip this routes. Also it's possible to skip a route based on methods or just skip body property from a route.

# Installation

```sh
npm install --save escriba
```

# Usage

Escriba provides two kinds of logger: logger and httpLogger.

## Logger

Use logger if you want to add some additional log across your application. For example, to log information from an userController hidding the password property:

```js
const log4js = require('log4js').getLogger()
const escriba = require('escriba')
const cuid = require('cuid')

const { logger } = escriba({ 
  loggerEngine: log4js, 
  service: 'api',
  sensitive: {
    password: {
      paths: ['password'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  }
})

logger.info({ text: 'Setting user permission', password: 'abc' }, { id: cuid(), from: 'userController' })
```

## Http logger

To log http request and response use the httpLogger. For this example we'll long only some properties: id, body and statusCode. 

Also we'll skip status route, options method and body property from routes that ends with .csv or .xlsx.

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

Every request and response will be logged, and the most cool part: both will have the same id. This is important because you can search for this id and get all information about your request and response.

This id is injected in req object, then if you need to log some extra information between a request and response just do something like:

```js
logger.info('some controller information', { id: req.id })
```

## Examples

The log-generator inside examples folder will run a nodejs application that will make request for itself every milliseconds decided by the user. The application will get the milleseconds value from an environment variable called `ESCRIBA_TIMEOUT`(3000 is the default value).

To use log-generator through Docker use this commands inside the log-generator folder:

```
docker build -t pagarme/log-generator:latest .

docker run -e ESCRIBA_TIMEOUT=3000 -p 3000:3000 -d pagarme/log-generator:latest
```

And to make some manual requests use:

```
curl -H "Content-Type: application/json" -X GET http://localhost:3000/escriba

curl -H "Content-Type: application/json" -X POST -d '{"username":"a name"}' http://localhost:3000/escriba
```

The log-generator example will get escriba library from npm, if you want to get the library directly from the repository run docker with -v option:

```
docker run -e ESCRIBA_TIMEOUT=3000 -p 3000:3000 -d -v $(cd ../../ && pwd):/escriba pagarme/log-generator:latest
```

## License

```
The MIT License (MIT)
Copyright (c) 2017 Pagar.me Pagamentos S/A
```
