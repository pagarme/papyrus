const tracer = require('dd-trace')
const formats = require('dd-trace/ext/formats')

module.exports = (log) => {
  const span = tracer.scope().active()

  if (span) {
    tracer.inject(span.context(), formats.LOG, log)
  }

  return log
}
