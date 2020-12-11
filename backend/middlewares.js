const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'MissingParameter') {
        return response.status(400).send({error: error.error})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    } else if (error.name === 'MongoError') {
        return response.status(400).json({error: error.message})
    } else if (error.name === 'Unauthorized') {
        return response.status(401).json({error: error.message})
    }

    next(error)
}

const parseToken = (token) => {
    if (!token || !token.toLowerCase().startsWith('bearer ')) return

    const trimmedToken =  token.substring('bearer '.length)
    return jwt.verify(trimmedToken, process.env.JWT_SECRET)
}

const tokenExtractor = (request, response, next) => {
    const authorizationToken = request.get('authorization')
    request["token"] = parseToken(authorizationToken)
    next()
}

module.exports = {
    errorHandler,
    tokenExtractor
}