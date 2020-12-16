import React from 'react'
import {
    Link
} from "react-router-dom"

const Games = ({games}) => {
    return (
        <div>
            <h1>Games</h1>
            {games.length === 0 ? <p>No games added</p> : null}
            {games.map(game => {
                return (
                    <div key={game.id}>
                        <Link to={'/games/' + game.id}>{game.name}</Link>
                    </div>
                )
            })}
        </div>
    )
}

export default Games