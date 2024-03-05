import React from 'react'
// import { Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation'
// import Footer from './components/Footer';
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const App = () => {
  return (
    <div className='flex flex-col bg-stone-100 h-screen'>
      <Navigation />
      {/* <Home /> */}
      <Outlet />
      {/* <Footer /> */}
      <ToastContainer />
    </div>
  )
}

export default App
