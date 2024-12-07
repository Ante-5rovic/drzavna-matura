import React from 'react'

import './stillInDevelopment.css'
import Navbar from '../../../Components/NavbarComponent/Navbar'
import Header from '../../../Components/HeaderComponent/Header'
import Footer from '../../../Components/FooterComponent/Footer'
import { Link } from 'react-router-dom'

const StillInDevelopment = () => {
  return (
    <section className='still-in-development-main-wrap'>
        <div id='still-in-development-top-ancor'></div>
        <Header/>
        <Navbar/>
        <div className='still-in-development-text-wrap'>
            <h1 className='still-in-development-title'>Ovaj predmet još nije dodan na stranicu.</h1>
            <h2 className='still-in-development-subtitle'>Vrati se na početnu stranicu klikom <Link to="/" className='still-in-development-subtitle-link'>OVDJE</Link>.</h2>
        </div>
        <div className='still-in-development-background-immage-wrap'>
            <img className='still-in-development-background-immage' src='\Images\ErrorPages\background.jpg' alt='error page immage'></img>  
        </div>
        <Footer footerImmageClass={"footer2"}/>
    </section>
  )
}

export default StillInDevelopment