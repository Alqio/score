const router = require('express').Router()
const User = require('../models/user')
const Game = require('../models/game')
const Score = require('../models/score')

const checkToken = (token) => {
    if (!token || !token.id) {
        const e = new Error('token missing or invalid')
        e.name = 'Unauthorized'
        throw e
    }
}

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
    const token = request.token
    checkToken(token)

    const user = await User.findById(token.id)

    const game = await Game.findById(request.params.id)

    if (game.user !== user.id) {
        return response.status(403)
    }

    const scores = await Score.find({game: game.id})

    const result = {
        ...game,
        scores
    }

    response.status(200).json(result)

})

module.exports = router