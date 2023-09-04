require('dotenv').config()
const { NODE_ENV, PORT, MONGODB_URI, TEST_MONGODB_URI } = process.env

const port = PORT
let connectionString = MONGODB_URI
if (NODE_ENV === 'test') {
  connectionString = TEST_MONGODB_URI
}

module.exports = {
  port,
  connectionString
}
