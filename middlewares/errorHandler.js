const ERROR_HANDLERS = {
  CastError: response => response.status(400).send({ error: 'malformatted id' }),
  ValidationError: (response, error) => response.status(400).json({ error: error.message }),
  JsonWebTokenError: (response) => response.status(401).json({ error: 'invalid token' }),
  TokenExpiredError: (response) => response.status(401).json({ error: 'token expired' }),
  defaultError: response => response.status(500).end()
}

function errorHandler(error, request, response, next) {
  console.error(error)

  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError

  handler(response, error)
}

module.exports = errorHandler
