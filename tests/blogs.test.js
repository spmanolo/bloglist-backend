const supertest = require('supertest')
const app = require('../app.js')
const mongoose = require('mongoose')
const { server } = require('../index.js')
const { initialBlogs, blogsInDb, nonExistingId } = require('../utils/test_helper.js')
const bcrypt = require('bcrypt')

const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promises = blogObjects.map(blog => blog.save())
  await Promise.all(promises)

  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({
    username: 'root',
    passwordHash
  })

  await user.save()
})

describe.skip('when there is initially some notes saved', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
  })
})

describe.skip('viewing a specific blog', () => {
  test('identificator is named id', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })

  test.skip('unique id is created', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(nonExistingId()).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  test('a new blog can be created correctly', async () => {
    // login first
    const user = {
      username: 'root',
      password: 'sekret'
    }

    const login = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = login.body.token

    const newBlog = {
      title: 'El mejor blog',
      author: 'Paqui',
      url: 'elmejorblog.com'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    const titles = blogsAtEnd.map(blog => blog.title)

    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
    expect(titles).toContain(newBlog.title)
  })

  test.skip('if title or url properties are missing, response is 400', async () => {
    const newBlog = {}

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await blogsInDb()

    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })

  test.skip('if likes property is missing, it is set to 0', async () => {
    const newBlog = {
      title: 'El mejor blog',
      author: 'yo',
      url: 'elmejorblog.com'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
  })

  test('throw 401 if token is not provided', async () => {
    const blogsAtStart = await blogsInDb()

    const newBlog = {
      title: 'El mejor blog',
      author: 'Paqui',
      url: 'elmejorblog.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })
})

describe.skip('deleting a blog', () => {
  test('a blog can be deleted correctly', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToDelete = await blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe.skip('updating a blog', () => {
  test('a blog can be updated correctly', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const newBlog = {
      title: 'Este es el título del nuevo blog',
      author: 'Nuevo Autor',
      url: 'nuevoautor.com'
    }

    const updatedNote = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect()
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
