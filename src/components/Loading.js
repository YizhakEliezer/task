import React from 'react'
import '../globals.css';


const Loading = () => {
    return (

        <div className="main-sipnner">
            <div className="header">
                <i className="fa-solid fa-list-check"></i>
            </div>

            <div className='spinner'>
                <span class="loader"></span>
            </div>
        </div>
    )
}

export default Loading
