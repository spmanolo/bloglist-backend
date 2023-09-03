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
  mostBlogs
}
