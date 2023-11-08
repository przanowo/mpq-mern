import React from 'react';
// import { Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
// import Footer from './components/Footer';
// import Home from './pages/Home';
// import Home from './pages/Home';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <div className='flex flex-col lg:min-h-screen lg:bg-cover lg:bg-center lg:h-screen lg:bg-[url(https://firebasestorage.googleapis.com/v0/b/miniparfumqueen.appspot.com/o/images%2Fbg%2Fmpq-bg.jpg?alt=media&token=68c2375b-3f6c-4bae-9cab-536a93e035f4)]'>
      <Navigation />
      {/* <Home /> */}
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
};

export default App;
