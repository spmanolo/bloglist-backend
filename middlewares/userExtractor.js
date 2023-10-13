const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
  const autorization = request.get('authorization')

  const token = autorization && autorization.toLowerCase().startsWith('bearer ')
    ? autorization.substring(7)
    : null

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const { id: userID } = decodedToken

  request.userID = userID

  next()
}
