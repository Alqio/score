const mongoose = require('mongoose')


const gameSchema = mongoose.Schema({
    name: String,
    hash: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    scores: {
        type: [
            {
                score: Number,
                date: Date,
                scorer: String
            }
        ],
        default: []
    }
})
gameSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
const Game = mongoose.model('Game', gameSchema)

module.exports = Game
