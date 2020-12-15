import React from 'react'

const Game = ({game}) => {

    const scores = () => {
        return game.scores
            .sort((a, b) => b.score - a.score)
            .map(score => <li key={score.date}>{score.score} by {score.scorer} {score.date} </li>)
    }

    const scoreText = () => {
        if (game.scores.length === 0)
            return <p>No scores</p>
        else
            return <h4>Scores</h4>
    }

    const hash = () => {
        if (game.hash)
            return <p>Hash: {game.hash}</p>
        else
            return null
    }

    return (
        <div>
            <h3>{game.name}</h3>
            <p>id: {game.id}</p>
            {hash()}
            {scoreText()}
            <ol>
                {scores()}
            </ol>
        </div>
    )
}

export default Game