import React from 'react'

const Logout = ({setUser}) => {

    const handleLogout = async (event) => {
        event.preventDefault()
        setUser(null)
        localStorage.removeItem('user')
    }

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Logout