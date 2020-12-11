const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const config = require('./config')
const middlewares = require('./middlewares')


mongoose.connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

app.use(cors())
app.use(express.json())
app.use(middlewares.tokenExtractor)
app.use('/api/users/', userRouter)
app.use('/api/login/', loginRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/db')
    app.use('/api/testing/', testingRouter)
}

app.use(middlewares.errorHandler)
module.exports = app