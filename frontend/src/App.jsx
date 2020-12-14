import './App.css';
import Login from "./components/Login";
import React, {useEffect, useState} from 'react'
import Notification from "./components/Notification";
import Logout from "./components/Logout";
import Games from "./components/Games";
import gameService from './services/game'
import AddGame from "./components/AddGame";


const App = () => {

    const [games, setGames] = useState([])

    const [notification, setNotification] = useState({
        message: null,
        color: 'green'
    })

    const [user, setUser] = useState(null)

    useEffect(() => {
        let mounted = true;
        const getGames = async () => {
            const newGames = await gameService.getGames()
            setGames(newGames)
        }
        if (mounted) {
            getGames()
        }

        return () => mounted = false;

    }, [])

    const createNotification = (message, color) => {
        setNotification({
            message, color
        })
        setTimeout(() => setNotification({message: null, color: 'green'}), 5000)
    }

    const loginForm = () => {
        if (user) {
            return (
                <div>
                    <p>Logged in as {user.name}</p> <Logout setUser={setUser}/>
                </div>
            )
        } else {
            return (
                <div>
                    <Login createNotification={createNotification} setUser={setUser}/>
                </div>
            )
        }
    }

    const loggedIn = () => {
        if (user) {
            return <AddGame setGames={setGames} games={games}/>
        } else {
            return null
        }
    }

    return (
        <div className="App">
            <Notification message={notification.message} color={notification.color}/>

            {loginForm()}
            <br/>
            {loggedIn()}
            <Games games={games}/>



        </div>
    );
}

export default App;
