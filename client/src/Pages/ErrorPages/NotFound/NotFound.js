import React from 'react'

import './notFound.css'

import Navbar from '../../../Components/NavbarComponent/Navbar'
import Header from '../../../Components/HeaderComponent/Header'
import Footer from '../../../Components/FooterComponent/Footer'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <section className='not-found-main-wrap'>
        <Header/>
        <Navbar/>
        <div className='not-found-text-wrap'>
            <h1 className='not-found-title'>ERROR došlo je do greške na serveru.</h1>
            <h2 className='not-found-subtitle'>Vrati se na početnu stranicu klikom <Link to="/" className='not-found-subtitle-link'>OVDJE</Link>.</h2>
        </div>
        <div className='not-found-background-immage-wrap'>
            <img className='not-found-background-immage' src='\Images\ErrorPages\errorNotFound.png' alt='error page immage'></img>  
        </div>
        <Footer footerImmageClass={"footer2"}/>
    </section>
  )
}

export default NotFound