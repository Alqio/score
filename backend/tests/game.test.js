const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const games = require('./helper').games
const Game = require('../models/game')
const User = require('../models/user')
const Score = require('../models/score')
const bcrypt = require('bcrypt')

let token
let userId

beforeEach(async () => {
    await Game.deleteMany({})
    await User.deleteMany({})
    await Score.deleteMany({})

    let noteObject = new Game(games[0])
    await noteObject.save()

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'test_user1', password: passwordHash })

    await user.save()

    userId = user.id

    const res = await api.post('/api/login').send({username: 'test_user1', password: 'sekret'})
    token = 'Bearer ' + res.body.token
})


describe('GET /api/games', () => {
    test('returns json', async () => {
        await api
            .get('/api/games')
            .expect(200)
            .expect('Content-Type', /application\/json/)

    })
    test('returns games with id field, not _id', async () => {
        const res = await api.get('/api/games')

        const b = res.body

        expect(b[0].id).toBeDefined()
        expect(b[0]._id).not.toBeDefined()

    })
    test('returns correct games', async () => {
        const res = await api.get('/api/games')

        const contents = res.body.map(r => r.hash)
        expect(contents[0]).toEqual('testhash')

    })
})

describe('POST /api/games', () => {
    beforeEach(async () => {
        await Game.deleteMany({name: 'Test game'})
    })

    const game = {
        name: 'Test game'
    }

    test('returns json', async () => {
        await api
            .post('/api/games')
            .send(game)
            .set('Authorization', token)
            .expect(201)
            .expect('Content-Type', /application\/json/)

    })
    test('fails without token', async () => {
        await api
            .post('/api/games')
            .send(game)
            .expect(401)
    })
    test('adds a new game', async () => {
        const initalgames = await Game.find({})

        await api.post('/api/games').send(game).set('Authorization', token)

        const gamesAfter = await Game.find({})
        expect(gamesAfter.length).toEqual(initalgames.length + 1)

        const user = await User.findOne({username: 'test_user1'})

        const b = await Game.find({name: 'Test game'})
        expect(b[0].user.toString()).toEqual(user.id)

    })
    test('adds correct game', async () => {
        await api.post('/api/games').send(game).set('Authorization', token)
        const addedGame = await Game.findOne({name: 'Test game'})
        expect(addedGame).toBeDefined()

    })
    test('adding a game should not set hash', async () => {
        await api.post('/api/games').send(game).set('Authorization', token)
        const addedGame = await Game.findOne({name: 'Test game'})
        expect(addedGame.hash).not.toBeDefined()

    })
})

describe('DELETE /api/games', () => {

    const game = {
        name: 'Test game',
    }
    let id

    beforeEach(async () => {
        await Game.deleteMany({})
        const gameObject = new Game({
            ...game,
            user: userId
        })
        await gameObject.save()
        const b = await Game.findOne({name: 'Test game'})
        id = b.id

    })

    test('returns json', async () => {
        const url = '/api/games/' + id
        await api
            .delete(url)
            .set('Authorization', token)
            .expect(200)
            .expect('Content-Type', /application\/json/)

    })
    test('deletes a game', async () => {
        const initalgames = await Game.find({})

        await api.delete('/api/games/' + id).set('Authorization', token)

        const gamesAfter = await Game.find({})

        expect(gamesAfter.length).toEqual(initalgames.length - 1)

    })
    test('deletes correct game', async () => {
        await api.delete('/api/games/' + id).set('Authorization', token)
        const deletedGame = await Game.findOne({name: 'Test game'})
        expect(deletedGame).toBeNull()

    })
})


afterAll(() => {
    mongoose.connection.close()
})