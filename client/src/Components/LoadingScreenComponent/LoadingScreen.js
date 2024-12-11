import React from 'react'
import { HashLoader } from 'react-spinners';
import './loadingScreen.css'

const LoadingScreen = () => {
  return (
    <div className='loading-screen-main-wrap'>
        <div className='loading-screen-wrap'>
            <HashLoader size={100} color='#4b70f5'/>
        </div>
    </div>
  )
}

export default LoadingScreen