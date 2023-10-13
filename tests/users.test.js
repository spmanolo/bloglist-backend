const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const { server } = require('../index')
const { usersInDb } = require('../utils/test_helper')
const bcrypt = require('bcrypt')

const User = require('../models/user')
const api = supertest(app)

describe('when theres initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'root',
      passwordHash
    })

    await user.save()
  })

  test('a new user can be created correctly', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'pepeviyuela',
      name: 'pepe viyuela',
      password: 'pepe'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('when password is missing return 400', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'root',
      password: '1234'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.errors.username.message).toContain('`username` to be unique')

    const usersAtEnd = await usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('if password has less than 3 characters return 400', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: '12'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('Password is required or must be at least 3 characters long')

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
