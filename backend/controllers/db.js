const router = require('express').Router()
const Game = require('../models/game')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
    await Game.deleteMany({})
    await User.deleteMany({})
    response.status(204).end()
})

module.exports = router
