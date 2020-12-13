import axios from 'axios'

const login = async (data) => {
    const response = await axios.post('http://localhost:3003/api/login/', data)
    return response.data
}

export default { login }
