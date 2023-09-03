const config = require('./utils/config.js')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs.js')
const { requestLogger } = require('./utils/middlewares.js')
const logger = require('./utils/logger.js')
const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Database connect')
  })
  .catch(err => {
    logger.error('error connecting to MongoDB:', err.message)
  })

app.use(express.json())
app.use(cors())
app.use(requestLogger)

app.use('/api/blogs', blogsRouter)

module.exports = app
