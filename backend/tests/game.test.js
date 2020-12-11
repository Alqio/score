const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const games = require('./helper').games
const Game = require('../models/game')
const User = require('../models/user')
const bcrypt = require('bcrypt')

let token
let userId

beforeEach(async () => {
    await Game.deleteMany({})
    await User.deleteMany({})

    let noteObject = new Game(games[0])
    await noteObject.save()

    noteObject = new Game(games[1])
    await noteObject.save()

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'test_user1', password: passwordHash })

    await user.save()

    userId = user.id

    const res = await api.post('/api/login').send({username: 'test_user1', password: 'sekret'})
    token = "Bearer " + res.body.token
})


describe('GET /api/blogs', () => {
    test('returns json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

    })
    test('returns blogs with id field, not _id', async () => {
        const res = await api.get('/api/blogs')

        const b = res.body

        expect(b[0].id).toBeDefined()
        expect(b[1].id).toBeDefined()
        expect(b[0]._id).not.toBeDefined()
        expect(b[1]._id).not.toBeDefined()

    })
    test('returns correct blogs', async () => {
        const res = await api.get('/api/blogs')

        const contents = res.body.map(r => r.id)
        expect(contents[0]).toEqual('5a422a851b54a676234d17f7')
        expect(contents[1]).toEqual('5a422aa71b54a676234d17f8')

    })
})

describe('POST /api/blogs', () => {
    beforeEach(async () => {
        await Blog.deleteMany({title: 'Test blog'})
    })

    const blog = {
        title: 'Test blog',
        author: 'Meikä mandoliini',
        url: 'google.com',
    }

    test('returns json', async () => {
        await api
            .post('/api/blogs')
            .send(blog)
            .set('Authorization', token)
            .expect(201)
            .expect('Content-Type', /application\/json/)

    })
    test('fails without token', async () => {
        await api
            .post('/api/blogs')
            .send(blog)
            .expect(401)
    })
    test('adds a new blog', async () => {
        const initalBlogs = await Blog.find({})

        await api.post('/api/blogs').send(blog).set('Authorization', token)

        const blogsAfter = await Blog.find({})
        expect(blogsAfter.length).toEqual(initalBlogs.length + 1)

        const user = await User.findOne({username: 'test_user1'})

        const b = await Blog.find({title: 'Test blog'})
        expect(b[0].user.toString()).toEqual(user.id)

    })
    test('adds correct blog', async () => {
        await api.post('/api/blogs').send(blog).set('Authorization', token)
        const addedBlog = await Blog.findOne({title: 'Test blog'})
        expect(addedBlog).toBeDefined()

    })
    test('adding a blog without likes should set them to 0', async () => {
        await api.post('/api/blogs').send(blog).set('Authorization', token)
        const addedBlog = await Blog.findOne({title: 'Test blog'})
        expect(addedBlog.likes).toEqual(0)

    })
    test('adding a blog without url or title should respond 400', async () => {
        await api
            .post('/api/blogs')
            .send({
                title: 'jou',
                author: 'google.com'
            })
            .set('Authorization', token)
            .expect(400)

        await api
            .post('/api/blogs')
            .send({
                author: 'jou',
                url: 'google.com'
            })
            .set('Authorization', token)
            .expect(400)
    })
})

describe('DELETE /api/blogs', () => {

    const blog = {
        title: 'Test blog',
        author: 'Meikä mandoliini',
        url: 'google.com',
    }
    let id

    beforeEach(async () => {
        await Blog.deleteMany({})
        const blogObject = new Blog({
            ...blog,
            user: userId
        })
        await blogObject.save()
        const b = await Blog.findOne({title: 'Test blog'})
        id = b.id

    })

    test('returns json', async () => {
        const url = '/api/blogs/' + id
        await api
            .delete(url)
            .set('Authorization', token)
            .expect(200)
            .expect('Content-Type', /application\/json/)

    })
    test('deletes a blog', async () => {
        const initalBlogs = await Blog.find({})

        await api.delete('/api/blogs/' + id).set('Authorization', token)

        const blogsAfter = await Blog.find({})

        expect(blogsAfter.length).toEqual(initalBlogs.length - 1)

    })
    test('deletes correct blog', async () => {
        await api.delete('/api/blogs/' + id).set('Authorization', token)
        const deletedBlog = await Blog.findOne({title: 'React patterns'})
        expect(deletedBlog).toBeNull()

    })
})

describe('PUT /api/blogs', () => {

    const blog = {
        title: 'Test blog',
        author: 'Meikä mandoliini',
        url: 'google.com',
    }
    const updatedBlog = {
        title: 'Actual blog',
        author: 'Teikä mandoliini',
        url: 'amazon.com',
    }
    let id

    beforeEach(async () => {
        await Blog.deleteMany({})
        const blogObject = new Blog(blog)
        await blogObject.save()
        const b = await Blog.findOne({title: 'Test blog'})
        id = b.id

    })

    test('returns json', async () => {
        const url = '/api/blogs/' + id
        await api
            .put(url)
            .send(updatedBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

    })
    test('updates blog', async () => {
        const initalBlogs = await Blog.find({})

        await api.put('/api/blogs/' + id).send(updatedBlog)

        const blogsAfter = await Blog.find({})

        expect(blogsAfter.length).toEqual(initalBlogs.length)

        const modified = await Blog.findOne({title: 'Actual blog'})
        expect(modified).toBeDefined()
        expect(modified.url).toEqual('amazon.com')
    })
})



afterAll(() => {
    mongoose.connection.close()
})