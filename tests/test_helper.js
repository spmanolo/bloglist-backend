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

function dummy(blogs) {
  return 1
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
  dummy,
  totalLikes,
  mostBlogs,
  favouriteBlog
}
