import React from 'react'

import Navbar from '../../../Components/NavbarComponent/Navbar'
import Header from '../../../Components/HeaderComponent/Header'
import Footer from '../../../Components/FooterComponent/Footer'

const Login = () => {
  return (
    <div className='log-in-main-wrap'>
        <Header/>
        <Navbar/>
        <section className='log-in-section-wrap'>

        </section>
        <Footer footerImmageClass={"footer2"}/>
    </div>
  )
}

export default Login