const escriba = require('escriba')
const log4js = require('log4js')

const log4jsConfig = {
  appenders: [{
    type: 'console',
    layout: {
      type: 'pattern',
      pattern: '%m'
    }
  }]
}
log4js.configure(log4jsConfig)

const escribaConfig = {
  loggerEngine: log4js.getLogger(),
  service: 'Escriba App',
  httpConf : {
    propsToLog: {
      request: [
        'id',
        'method',
        'url',
        'body',
        'httpVersion',
        'referrer',
        'referer',
        'user-agent'
      ],
      response: [
        'id',
        'method',
        'url',
        'company._id',
        'company.name',
        'statusCode',
        'body',
        'httpVersion',
        'referrer',
        'referer',
        'user-agent',
        'latency'
      ]
    }
  }
}

module.exports = escriba(escribaConfig)
