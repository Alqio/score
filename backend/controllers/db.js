const router = require('express').Router()
const Game = require('../models/game')
const Score = require('../models/score')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
    await Game.deleteMany({})
    await Score.deleteMany({})
    await User.deleteMany({})
    response.status(204).end()
})

module.exports = router
