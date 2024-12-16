import React from 'react'
import Header from '../../../Components/HeaderComponent/Header'
import Navbar from '../../../Components/NavbarComponent/Navbar'
import Footer from '../../../Components/FooterComponent/Footer'

const Profile = () => {
  return (
    <main className='profile-main-wrap'>
        <Header/>
        <Navbar/>
        <Footer footerImmageClass={"footer1"} />
    </main>
  )
}

export default Profile