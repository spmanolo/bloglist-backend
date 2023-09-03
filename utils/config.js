require('dotenv').config()

const PORT = process.env.PORT || 3001
const MONGODB_URI = 'mongodb+srv://manolosan2001:nomelase@cluster0.robqroq.mongodb.net/meitexdb?retryWrites=true&w=majority'

module.exports = {
  PORT,
  MONGODB_URI
}
