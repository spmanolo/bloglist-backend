const Blog = require('../models/blog.js')

const initialBlogs = [
  {
    title: 'Este es mi blog',
    author: 'Pepe',
    url: 'miblog.com',
    likes: 1
  },
  {
    title: 'Mi blog es estupendo!!',
    author: 'Pablo',
    url: 'elblogdepablo.com',
    likes: 5
  },
  {
    title: 'El blog de Julia',
    author: 'Julia',
    url: 'julia-blogs.com',
    likes: 14
  }
]

async function blogsInDb() {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

async function nonExistingId() {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'pepe',
    url: 'pepe.com'
  })
  await blog.save()
  await blog.remove()

  return blog.id.toString()
}

function totalLikes(blogs) {
  let sum = 0
  blogs.forEach(blog => {
    sum += blog.likes
  })
  return sum
}

function favouriteBlog(blogs) {
  let favourite = blogs[0]

  blogs.forEach(blog => {
    if (blog.likes > favourite.likes) { favourite = blog }
  })

  return favourite
}

function mostBlogs(blogs) { }

module.exports = {
  initialBlogs,
  totalLikes,
  mostBlogs,
  favouriteBlog,
  blogsInDb,
  nonExistingId
}
