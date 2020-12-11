require('dotenv').config()

const mongoUrl = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_URI : process.env.DB_URI
const port = process.env.PORT

module.exports = {
    mongoUrl,
    port
}
