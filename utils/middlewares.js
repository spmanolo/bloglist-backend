const logger = require('./logger.js')

function requestLogger(request, response, next) {
  logger.info(request.method)
  logger.info(request.path)
  logger.info(request.body)

  next()
}

function unknownEndpoint(request, response) {
  response.status(404).send({ error: 'unknown endpoint' })
}

function errorHandler(error, request, response, next) {
  console.error(error)

  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    response.status(400).send({ error: error.message })
  } else {
    response.status(500).end()
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
