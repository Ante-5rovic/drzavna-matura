import React from 'react'
import Header from '../../Components/HeaderComponent/Header'
import Navbar from '../../Components/NavbarComponent/Navbar'
import Footer from '../../Components/FooterComponent/Footer'

const MaturaList = ({imePredmeta,razinaPredmeta}) => {
  return (
    <main>
        <Header/>
        <Navbar/>
        <h1>{imePredmeta}</h1>
        <h1>{razinaPredmeta}</h1>
        <Footer footerImmageClass={"footer1"} />
    </main>
  )
}

export default MaturaList