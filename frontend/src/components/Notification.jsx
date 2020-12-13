import React from 'react'


const Notification = ({message, color}) => {

    const style = {
        color: color,
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    };

    if (message === null) {
        return null
    } else {
        return (
            <div style={style} className="notification">{message}</div>
        )
    }
};

export default Notification
