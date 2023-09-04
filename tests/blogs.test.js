const supertest = require('supertest')
const app = require('../app.js')
const mongoose = require('mongoose')
const { server } = require('../index.js')
const { initialBlogs } = require('./test_helper.js')

const Blog = require('../models/blog.js')
const api = supertest(app)

describe('test blog app', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
