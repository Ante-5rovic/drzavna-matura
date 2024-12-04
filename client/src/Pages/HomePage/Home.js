import React from 'react'

import './home.css'

import Header from '../../Components/HeaderComponent/Header'
import Navbar from '../../Components/NavbarComponent/Navbar'

const Home = () => {
  return (
    <main className='home-main-wrap'>
        <Header/>
        <Navbar/>
        <section className='home-section-wrap-TEST'>
          hmm
        </section>
    </main>
  )
}

export default Home