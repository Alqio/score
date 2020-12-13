import axios from 'axios'

const getGames = async () => {
    const response = await axios.get('http://localhost:3003/api/games/')
    return response.data
}

export default { getGames }
