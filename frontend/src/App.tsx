import React from 'react';
// import { Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
// import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const App = () => {
  return (
    <div className='flex flex-col lg:bg-cover lg:bg-center lg:bg-[url(https://firebasestorage.googleapis.com/v0/b/miniparfumqueen.appspot.com/o/images%2Fbg%2Fmpq-bg.jpg?alt=media&token=68c2375b-3f6c-4bae-9cab-536a93e035f4)]'>
      <Navigation />
      {/* <Home /> */}
      <Outlet />
      {/* <Footer /> */}
      <ToastContainer />
    </div>
  );
};

export default App;
