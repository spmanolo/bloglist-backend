const config = require('./utils/config.js')
const express = require('express')
const app = express()
const cors = require('cors')

const blogsRouter = require('./controllers/blogs.js')
const usersRouter = require('./controllers/users.js')
const loginRouter = require('./controllers/login.js')

const errorHandler = require('./middlewares/errorHandler.js')
const unknownEndpoint = require('./middlewares/unknownEndpoint.js')
const requestLogger = require('./middlewares/requestLogger.js')

const logger = require('./utils/logger.js')
const mongoose = require('mongoose')

mongoose.connect(config.connectionString)
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
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
