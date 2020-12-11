const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')

router.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findOne({username: body.username})

    const passwordCorrect = user === null ? false : await bcrypt.compare(body.password, user.password)

    if (!(user && passwordCorrect)) {
        const e = new Error('Invalid username or password')
        e.name = 'Unauthorized'
        throw e
    }

    const u = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(u, process.env.JWT_SECRET)

    response.status(200).send({token, username: user.username, name: user.name})
})

module.exports = router