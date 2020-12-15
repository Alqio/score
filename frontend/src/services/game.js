import axios from 'axios'

const baseUrl = 'http://localhost:3003/api'

const getGames = async () => {
    const user = localStorage.getItem('user')
    let response
    if (user) {
        const token = JSON.parse(user).token
        const config = {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }
        response = await axios.get(`${baseUrl}/games/`, config)
    } else {
        response = await axios.get(`${baseUrl}/games/`)
    }

    return response.data
}

const createGame = async (game) => {
    const user = localStorage.getItem('user')
    const token = JSON.parse(user).token

    console.log(token)

    const config = {
        headers: {
            Authorization: 'Bearer ' + token
        }
    }

    const response = await axios.post(`${baseUrl}/games/`, game, config)
    return response.data

}

export default {getGames, createGame}
