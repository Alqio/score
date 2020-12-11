const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const games = require('./helper').games
const scores = require('./helper').scores
const Game = require('../models/game')
const User = require('../models/user')
const Score = require('../models/score')
const bcrypt = require('bcrypt')

let token
let userId
let game
beforeEach(async () => {
    await Game.deleteMany({})
    await User.deleteMany({})
    await Score.deleteMany({})

    game = new Game(games[0])
    await game.save()

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'test_user1', password: passwordHash })

    await user.save()

    userId = user.id

    const res = await api.post('/api/login').send({username: 'test_user1', password: 'sekret'})
    token = 'Bearer ' + res.body.token
})

describe('POST /api/games/:gameId/scores/', () => {

    test('returns json', async () => {
        const data = {
            hash: 'testhash',
            ...scores[0]
        }
        await api
            .post(`/api/games/${game._id}/scores/`)
            .send(data)
            .set('Authorization', token)
            .expect(201)
            .expect('Content-Type', /application\/json/)

    })
    test('fails without correct hash', async () => {
        const data = {
            hash: 'wrong hash',
            ...scores[0]
        }
        await api
            .post(`/api/games/${game._id}/scores/`)
            .send(data)
            .set('Authorization', token)
            .expect(401)
    })
    test('adds a new score', async () => {
        const initialScores = await Score.find({})

        const data = {
            hash: 'testhash',
            ...scores[0]
        }

        await api
            .post(`/api/games/${game._id}/scores/`)
            .send(data)
            .set('Authorization', token)

        const scoresAfter = await Score.find({})
        expect(scoresAfter.length).toEqual(initialScores.length + 1)

        const score = await Score.findOne({...scores[0]})

        expect(score.game.toString()).toEqual(game._id)

        const g = await Game.findById(game.id)
        expect(g.scores[0].scorer).toEqual(scores[0].scorer)
        expect(g.scores[0].score).toEqual(scores[0].score)
    })
})

afterAll(() => {
    mongoose.connection.close()
})