const router = require('express').Router()
const User = require('../models/user')
const Game = require('../models/game')
const bcrypt = require('bcrypt')

const checkToken = (token) => {
    if (!token || !token.id) {
        const e = new Error('token missing or invalid')
        e.name = 'Unauthorized'
        throw e
    }
}

router.get('', async (request, response) => {
    const token = request.token
    let isLoggedIn = true
    let user
    try {
        checkToken(token)
        user = await User.findById(token.id)
    } catch (e) {
        isLoggedIn = false
    }
    const games = (await Game.find({})).map(game => {

        const gameData = {
            scores: game.scores,
            name: game.name,
            id: game.id
        }

        if (isLoggedIn && game.user.toString() === user.id) {
            gameData.hash = game.hash
        }

        return gameData
    })
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
    game.hash = await bcrypt.hash(game.id, 1)

    const result = await game.save()

    response.status(201).json(result)

})

router.get('/:id', async (request, response) => {
    const game = await Game.findById(request.params.id)

    response.status(200).json(game)

})

router.delete('/:id/', async (request, response) => {
    const token = request.token
    checkToken(token)

    //TODO: how to check the game is owned by the user
    const game = await Game.deleteOne({_id: request.params.id})

    response.send(game)

})

router.post('/:gameId/scores/', async (request, response) => {

    const body = request.body
    const hash = body.hash
    const game = await Game.findById(request.params.gameId)

    if (hash !== game.hash) {
        return response.status(401).end()
    }

    const score = {
        score: body.score,
        scorer: body.scorer,
        date: new Date(body.date),
    }

    const newScores = [...game.scores, score]

    await Game.findOneAndUpdate(
        {_id: request.params.gameId},
        {scores: newScores},
        {runValidators: true}
    )

    const result = await Game.findById(request.params.gameId)

    response.status(201).json(result)

})

module.exports = router