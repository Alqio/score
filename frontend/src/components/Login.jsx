import React, {useState} from 'react'
import loginService from "../services/login";

const Login = ({onLogin, createNotification}) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({
                username,
                password
            })
            onLogin(user)

        } catch (e) {
            createNotification('wrong username or password', 'red')
            console.log("Login failed:")
            console.error(e)
        }
        setUsername('')
        setPassword('')
    }

    return (
        <div>
            <h2>Log in to application</h2>
            <form onSubmit={handleLogin}>
                <div>
                    Username <input
                        type="text"
                        id="username"
                        value={username}
                        name="Username"
                        onChange={({target}) => setUsername(target.value)}
                    />
                </div>
                <div>
                    Password <input
                        type="password"
                        id="password"
                        value={password}
                        name="Password"
                        onChange={({target}) => setPassword(target.value)}
                    />
                </div>
                <button type="submit" id="login">login</button>
            </form>
        </div>
    )
}

export default Login