const mongoose = require('mongoose')

const scoreSchema = mongoose.Schema({
    score: Number,
    date: Date,
    scorer: String,
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    }
})
scoreSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
const Score = mongoose.model('Score', scoreSchema)

module.exports = Score
