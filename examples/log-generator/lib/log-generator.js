const axios = require('axios')
const loremIpsum = require('lorem-ipsum')
const { logger } = require('./logger')

const request = axios.create({ baseURL: 'http://localhost:3000' })

const doRequests = () => {
  // The UnhandlePromiseRejectionWarning is intentional
  request.get('/escriba')
  request.post('/escriba', { data: loremIpsum() })
  request.put('/escriba')
  request.delete('/escriba')
}

const logRandomInfos = () => {
  logger.info('Info log')
  logger.warn('Warn log')
  logger.error('Error log')
}

const createLogs = () => {
  logRandomInfos()
  doRequests()
}

const logGenerator = (timeout = 3000) => {
  setInterval(createLogs, timeout)
}

module.exports = { start: logGenerator }
