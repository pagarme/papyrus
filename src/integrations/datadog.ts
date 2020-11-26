import tracer from 'dd-trace'
import formats from 'dd-trace/ext/formats'

export default (log: any) => {
  const span = tracer.scope().active()

  if (span) {
    tracer.inject(span.context(), formats.LOG, log)
  }

  return log
}
