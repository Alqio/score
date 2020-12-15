import React from 'react'
import Game from "./Game";

const Games = ({games}) => {
    return (
        <div>
            <h1>Games</h1>
            {games.length === 0 ? <p>No games added</p> : null}
            {games.map(game => {
                return (
                    <div key={game.id}>
                        <Game game={game}/>
                        <p>---</p>
                    </div>
                )
            })}
        </div>
    )
}

export default Games