const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const userExtractor = require('../middlewares/userExtractor.js')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  try {
    const blog = request.body

    const { userID } = request

    const user = await User.findById(userID)

    if (!user) {
      return response.status(401).json({
        error: 'You must be logged in to create a blog'
      })
    }

    const newBlog = new Blog({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: 0,
      user: user._id
    })

    const blogSaved = await newBlog.save()
    user.blogs = user.blogs.concat(blogSaved._id)
    await user.save()
    response.status(201).json(blogSaved)
  } catch (e) {
    next(e)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params
  const newBlog = request.body

  const blogToChange = {
    likes: newBlog.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, blogToChange, { new: true })
  response.status(201).json(updatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const { userID } = request
    const user = await User.findById(userID)
    const blog = await Blog.findById(request.params.id)

    console.log({ user })
    console.log({ blog })

    if (user._id.toString() !== blog.user.toString()) {
      return response.status(401).json({
        error: 'You are not authorized to delete this blog'
      })
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (e) {
    next(e)
  }
})

module.exports = blogsRouter
