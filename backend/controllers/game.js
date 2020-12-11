const router = require('express').Router()
const User = require('../models/user')
const Game = require('../models/game')
const Score = require('../models/score')
const bcrypt = require('bcrypt');

const checkToken = (token) => {
    if (!token || !token.id) {
        const e = new Error('token missing or invalid')
        e.name = 'Unauthorized'
        throw e
    }
}

router.get('', async (request, response) => {
    const games = await Game.find({})
    response.json(games)
})

router.post('', async (request, response) => {
    const token = request.token
    checkToken(token)

    const user = await User.findById(token.id)

    const game = new Game({
        ...request.body,
        user
    })

    const result = await game.save()

    response.status(201).json(result)

})

router.get('/:id', async (request, response) => {
    const game = await Game.findById(request.params.id)

    const scores = (await Score.find({game: game.id})).sort((a, b) => a.score - b.score)

    const result = {
        ...game,
        scores
    }

    response.status(200).json(result)

})

router.post('/:id/createHash', async (request, response) => {
    const token = request.token
    checkToken(token)

    const game = await Game.findById(request.params.id)

    const hash = await bcrypt.hash(game.id, 1)

    const updated = await Game.findOneAndUpdate({_id: request.params.id}, {...game, hash}, {runValidators: true})

    response.send(hash)

})

router.delete('/:id/', async (request, response) => {
    const token = request.token
    checkToken(token)

    //TODO: how to check the game is owned by the user
    const game = await Game.deleteOne({_id: request.params.id})

    response.send(game)

})

module.exports = router