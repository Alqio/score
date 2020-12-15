import React from 'react'

const Logout = ({onLogout}) => {

    const handleLogout = async (event) => {
        event.preventDefault()
        onLogout()
    }

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Logout