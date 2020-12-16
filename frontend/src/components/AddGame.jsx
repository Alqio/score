import React, {useState} from 'react'
import gameService from '../services/game'

const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    return {
        type,
        value,
        onChange
    }
}

const AddGame = ({games, setGames, createNotification}) => {
    const name = useField('text')

    const createGame = async (event) => {
        event.preventDefault()

        const game = {
            name: name.value
        }
        const createdGame = await gameService.createGame(game)
        console.log(createdGame)
        setGames(games.concat(createdGame))
        createNotification('Added game ' + game.name, 'green')
    }

    return (
        <div>
            <form onSubmit={createGame}>
                Game name: <input {...name}/>
                <br/>
                <button type='submit'>Create</button>
            </form>
        </div>
    )
}

export default AddGame