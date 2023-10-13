const usersRouter = require('express').Router()
const User = require('../models/user.js')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User
      .find({})
      .populate('blogs', { title: 1, author: 1, url: 1 })
    response.status(200).json(users)
  } catch (e) {
    next(e)
  }
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body

    if (!password || password.length < 3) {
      next({
        name: 'ValidationError',
        message: 'Password is required or must be at least 3 characters long'
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
  } catch (e) {
    response.status(400).json(e)
  }
})

module.exports = usersRouter
