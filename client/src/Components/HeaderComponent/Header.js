import React from 'react'
import './header.css'; 

const Header = () => {
  return (
    <header className='header-main-wrap'>
        <div className='header-content-wrap'> 
            <div className='header-title-logo-wrap'>
                <img id='header-logo-img' src='/Images/Logo/logo2.png' alt='logo'/>
                <div className='header-title-wrap'>
                    <h1 className='header-title'>MATURKO</h1>
                    <h2 className='header-subtitle'>Vježbaj maturu online</h2>
                </div>
            </div>
            <div className='header-registration-wrap'>
                <button id='header-button-login' className='header-button-design'>Prijava</button>
                <h3>|</h3>
                <button id='header-button-registe' className='header-button-design'>Registracija</button>
            </div>
        </div>
    </header>
  )
}

export default Header