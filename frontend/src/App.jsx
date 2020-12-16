import './App.css';
import Login from "./components/Login";
import React, {useEffect, useState} from 'react'
import Notification from "./components/Notification";
import Logout from "./components/Logout";
import Games from "./components/Games";
import gameService from './services/game'
import AddGame from "./components/AddGame";
import {
    BrowserRouter as Router,
    Switch, Route, Link,
    useParams, useHistory,
    useRouteMatch
} from "react-router-dom"
import Game from "./components/Game";


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

        if (localStorage.getItem('user')) {
            const u = JSON.parse(localStorage.getItem('user'))
            setUser(u)
        }

        return () => mounted = false;

    }, [])

    const onLogin = async (user) => {
        setUser(user)
        window.localStorage.setItem('user', JSON.stringify(user))
        console.log(user)
        const newGames = await gameService.getGames()
        setGames(newGames)
    }

    const onLogout = async () => {
        setUser(null)
        localStorage.removeItem('user')
        const newGames = await gameService.getGames()
        setGames(newGames)
    }

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
                    <p>Logged in as {user.name}</p>
                    <Logout onLogout={onLogout}/>
                </div>
            )
        } else {
            return (
                <div>
                    <Login createNotification={createNotification} onLogin={onLogin}/>
                </div>
            )
        }
    }
    const Menu = () => {
        const padding = {
            paddingRight: 5
        }
        return (
            <div>
                <Link to='/' style={padding}>anecdotes</Link>
                <Link to='/create' style={padding}>create new</Link>
                <Link to='/about' style={padding}>about</Link>
            </div>
        )
    }

    const loggedIn = () => {
        if (user) {
            return <AddGame setGames={setGames} games={games}/>
        } else {
            return null
        }
    }
    const match = useRouteMatch('/games/:id')
    console.log("match", match)
    const game = match ? games.find(game => game.id === match.params.id) : null

    return (
        <div className='App'>
            <Menu/>
            <Notification message={notification.message} color={notification.color}/>
            <Switch>
                <Route path='/about'>
                    <p>A game scoreboard</p>
                </Route>
                <Route path="/games/:id">
                    <Game game={game}/>
                </Route>
                <Route path='/create'>
                    {loggedIn()}
                </Route>
                <Route path='/'>
                    {loginForm()}
                    <Games games={games}/>
                </Route>
            </Switch>
        </div>
    );
}

export default App;
