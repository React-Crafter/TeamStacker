import React from 'react'

function Navbar() {
    return (
        <header className='header'>
            <nav className='nav'>
                <div className='logoAria'>
                    <h1 className='logo'> Crewwise </h1>
                </div>
                <div className='itemAria'>
                    <ul className='navItems'>
                        <li> <a href="/"> Home </a> </li>
                        <li> <a href="/"> About us </a> </li>
                        <li> <a href="/"> Clients </a> </li>
                        <li> <a href="/"> Info </a> </li>
                        <li> <a href="/"> Help </a> </li>
                    </ul>
                    <div className='searchbtnAria'>
                        <div className='searchAria'>
                            <input type="search" placeholder='search a job' />
                        </div>
                        <div className='btnAria'>
                            <button className='signupBtn'> Signup </button>
                            <button className='LoginBtn'> Login </button>
                        </div>
                    </div>
                </div>
            </nav>
        </header> 
    )
}

export default Navbar