import './App.css';
import Login from "./components/Login";
import React, {useState} from 'react'
import Notification from "./components/Notification";
import Logout from "./components/Logout";


const App = () => {

    const [notification, setNotification] = useState({
        message: null,
        color: 'green'
    })

    const [user, setUser] = useState(null)

    const createNotification = (message, color) => {
        setNotification({
            message, color
        })
        setTimeout(() => setNotification({message: null, color: 'green'}), 5000)
    }


    return (
        <div className="App">
            <Notification message={notification.message} color={notification.color}/>

            {user ? <Logout/> : <Login createNotification={createNotification} setUser={setUser}/>}
        </div>
    );
}

export default App;
