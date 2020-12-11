const router = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')

router.get('', async (request, response) => {
    const users = await User.find({})
    const blogs = await Blog.find({})

    const mapped = users.map((user) => {
        const myBlogs = blogs.filter(blog => blog.user && blog.user.id.toString('hex') === user.id).map(blog => {
            return {
                url: blog.url,
                author: blog.author,
                id: blog.id,
                title: blog.title
            }
        })

        return {
            username: user.username,
            name: user.name,
            blogs: myBlogs
        }
    })
    response.json(mapped)
})

router.post('', async (request, response, next) => {
    const body = request.body

    const password = body.password

    if (password.length < 3) {
        const e = new Error('Password length must be >= 3')
        e.name = 'ValidationError'
        throw e
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        password: passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
})

module.exports = router
