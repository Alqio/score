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

router.post('/', async (request, response) => {

    const body = request.body
    const hash = body.hash
    const game = await Game.findById(request.params.gameId)

    if (hash !== game.hash) {
        return response.status(401)
    }

    const score = new Score({
        score: body.score,
        date: new Date(body.date),
        game
    })

    const result = await score.save()

    response.status(201).json(result)

})

module.exports = router