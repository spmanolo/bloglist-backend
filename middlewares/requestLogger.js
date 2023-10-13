const logger = require('../utils/logger.js')

function requestLogger(request, response, next) {
  logger.info(request.method)
  logger.info(request.path)
  logger.info(request.body)

  next()
}

module.exports = requestLogger
