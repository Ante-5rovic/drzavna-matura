import React from 'react'

import './home.css'

import Header from '../../Components/HeaderComponent/Header'
import Navbar from '../../Components/NavbarComponent/Navbar'
import Footer from '../../Components/FooterComponent/Footer'

const Home = () => {
  return (
    <main className='home-main-wrap'>
        <Header/>
        <Navbar/>
        <section className='home-section-first-wrap'>
          hmm
        </section>
        <section className='home-section-second-wrap'>
          hmm
        </section>
        <section className='home-section-tird-wrap'>
          hmm
        </section>
        <Footer footerImmageClass={"footer1"}/>
    </main>
  )
}

export default Home