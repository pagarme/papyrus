require('dotenv').config()
require('dd-trace').init()
const express = require('express')
const bodyParser = require('body-parser')
const cuid = require('cuid')
const { logger, httpLogger } = require('./lib/logger')
const logGenerator = require('./lib/log-generator')

const app = express()
app.use(bodyParser.json())
app.use(httpLogger)

app.post('/escriba', (req, res) => {
  res.send(`The body of your POST is: ${JSON.stringify(req.body)}`)
})

app.get('/escriba', (req, res) => {
  res.send('This is a log-generator example!!!');
})

app.listen(3000, () => {
  logger.info('Escriba App listening on port 3000!', { id: cuid() })
})

logGenerator.start(process.env.ESCRIBA_TIMEOUT)
