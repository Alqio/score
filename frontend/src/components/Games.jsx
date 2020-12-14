import React from 'react'
import Game from "./Game";

const Games = ({games}) => {
    return (
        <div>
            {games.length === 0 ? <p>No games added</p> : null}
            {games.map(game => <Game key={game.id} game={game}/>)}
        </div>
    )
}

export default Games