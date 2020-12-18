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

    const adminInfo = () => {
        if (game.hash)
            return (
                <div>
                    <p>ID: {game.id}</p>
                    <p>Hash: {game.hash}</p>
                </div>
            )
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

            {adminInfo()}
            <button onClick={redirect}>Back</button>
            {scoreText()}
            <ol>
                {scores()}
            </ol>
        </div>
    )
}

export default Game