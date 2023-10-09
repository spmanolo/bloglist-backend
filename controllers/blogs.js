const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const logger = require('../utils/logger.js')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

blogsRouter.post('/', async (request, response) => {
  const blog = request.body

  const newBlog = new Blog({
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: 0
  })

  const blogSaved = await newBlog.save()
  response.status(201).json(blogSaved)
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

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter
