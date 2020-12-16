import React from 'react'
import {useHistory} from "react-router-dom";

const Game = ({game}) => {
    const history = useHistory()
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

    const redirect = (event) => {
        event.preventDefault()
        history.push('/')
    }

    return (
        <div>
            <h3>{game.name}</h3>
            <p>id: {game.id}</p>
            {hash()}
            <button onClick={redirect}>Back</button>
            {scoreText()}
            <ol>
                {scores()}
            </ol>
        </div>
    )
}

export default Game