import React from 'react'

const Game = ({game}) => {

    const scores = () => {
        return game.scores.map(score => <li key={score.date}>{score.score} by {score.scorer} {score.date} </li>)
    }

    return (
        <div>
            <h2>{game.name}</h2>
            <p>Hash: {game.hash}</p>
            <ul>
                {scores()}
            </ul>
        </div>
    )
}

export default Game