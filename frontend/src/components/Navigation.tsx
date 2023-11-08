import React, { useState, useEffect } from 'react';
import {
  HiMenuAlt1,
  HiOutlineHome,
  HiOutlineShoppingCart,
} from 'react-icons/hi';
import { MdOutlineAccountCircle } from 'react-icons/md';
import logoblack from '../logoblack.png';
import logowhite from '../logowhite.png';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const user = null;
  const cart = [];
  const [isAtTop, setIsAtTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const logoSrc = isAtTop ? logowhite : logoblack;
  const fixedLogoClasses = `${logoSrc}`;
  const navbarClasses = isAtTop ? 'text-white' : 'bg-white text-black';
  const fixedNavbarClasses = `lg:fixed z-20 w-screen px-4 transition duration-200 ease-in-out sm:h-18 md:px-8 lg:px-2.5 ${navbarClasses}`;

  useEffect(() => {
    // Function to handle scroll events
    const handleScroll = () => {
      if (window.scrollY > 0) {
        // Page is not at the top
        setIsAtTop(false);
      } else {
        // Page is at the top
        setIsAtTop(true);
      }
    };
    // Add the scroll event listener when the component mounts
    window.addEventListener('scroll', handleScroll);
    // Remove the scroll event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closeMobileMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className='lg: absolute z-20 h-26 sm:h-20 lg:h-20 overflow-hidden lg:mb-6'>
      <div className={fixedNavbarClasses}>
        <div className='flex items-center justify-center lg:justify-between max-w-screen h-full w-full'>
          <Link to='/'>
            {' '}
            <img
              className='hidden max-h-24 md:max-h-24 lg:max-h-16 lg:inline-flex focus:outline-none lg:pr-10 '
              alt='Logo'
              src={fixedLogoClasses}
            />{' '}
          </Link>

          {/* //desktop menu */}
          <div className='lg:flex hidden text-center items-center'>
            <Link
              className='px-3 py-2 rounded-lg hover:bg-white/20 hover:text-lg'
              to='/shop/parfum'
            >
              {' '}
              Perfume{' '}
            </Link>
            <Link
              className='px-3 py-2 rounded-lg hover:bg-white/20 hover:text-lg'
              to='/shop/miniature'
            >
              {' '}
              Miniature{' '}
            </Link>
            <Link
              className='px-3 py-2 rounded-lg hover:bg-white/20 hover:text-lg'
              to='/shop/sample'
            >
              {' '}
              Sample{' '}
            </Link>
            <Link
              className='px-3 py-2 rounded-lg hover:bg-white/20 hover:text-lg'
              to='/shop/soapandpowder'
            >
              {' '}
              Soap & Powder{' '}
            </Link>
            <Link
              className='px-3 py-2 rounded-lg hover:bg-white/20 hover:text-lg'
              to='/shop/gift'
            >
              {' '}
              Gifts{' '}
            </Link>
            <Link
              className='px-3 py-2 rounded-lg hover:bg-white/20 hover:text-lg'
              to='/shop/gold'
            >
              {' '}
              Gold{' '}
            </Link>
          </div>
          <div className='lg:flex hidden ltr:md:ml-6 rtl:md:mr-6 ltr:xl:ml-10 rtl:xl:mr-10 py-7'>
            {user ? ( // If user is logged in, show logout button
              <>
                <Link to='/'>
                  <button className='px-3 py-2'> Logout </button>
                </Link>
                <Link className='px-3 py-2 text-2xl text-center' to='/account'>
                  {' '}
                  <MdOutlineAccountCircle />{' '}
                </Link>
              </>
            ) : (
              // If user is not logged in, show login and register buttons
              <>
                <Link className='px-3 py-2' to='/login'>
                  {' '}
                  Login{' '}
                </Link>
                <Link className='px-3 py-2' to='/signup'>
                  {' '}
                  Register{' '}
                </Link>
              </>
            )}
            {user ? (
              <Link className='px-3 py-2' to='/admin'>
                {' '}
                Admin{' '}
              </Link>
            ) : null}
            {/* <Link className='px-3 py-2 text-2xl text-center' to='/checkout'> <HiOutlineShoppingCart /> </Link> */}
            <Link className='px-4 py-2 text-2xl text-center' to='/checkout'>
              <div className='relative block'>
                <HiOutlineShoppingCart />
                {cart.length > 0 && (
                  <span className='absolute -right-2 -bottom-3 text-red-500 text-base font-medium'>
                    {cart.length}
                  </span>
                )}
              </div>
            </Link>
          </div>
          {/* //mobile menu */}
          <div className='lg:hidden fixed z-10 bottom-0 flex items-center justify-between text-gray-700 body-font bg-white w-full h-14 sm:h-16 px-6 md:px-8 pb-3'>
            <button
              className='flex flex-col items-center justify-center flex-shrink-0 outline-none focus:outline-none'
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <HiMenuAlt1 />
            </button>
            <Link to='/' onClick={closeMobileMenu}>
              {' '}
              <HiOutlineHome />{' '}
            </Link>
            <div className='relative block'>
              <Link to='/checkout'>
                <HiOutlineShoppingCart />
                {cart.length > 0 && (
                  <span className='absolute -right-2 -bottom-3 text-red-500 text-base font-medium'>
                    {cart.length}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* //mobile menu Open */}
          {menuOpen && (
            <div className='flex lg:hidden fixed z-10 top-0 w-full h-full bg-white text-black justify-center items-center'>
              <div className='flex flex-col text-center '>
                <Link
                  className='px-3 py-4 rounded-lg text-xl'
                  to='/shop/parfum'
                  onClick={closeMobileMenu}
                >
                  {' '}
                  Perfume{' '}
                </Link>
                <Link
                  className='px-3 py-4 rounded-lg text-xl'
                  to='/shop/miniature'
                  onClick={closeMobileMenu}
                >
                  {' '}
                  Miniature{' '}
                </Link>
                <Link
                  className='px-3 py-4 rounded-lg text-xl'
                  to='/shop/sample'
                  onClick={closeMobileMenu}
                >
                  {' '}
                  Sample{' '}
                </Link>
                <Link
                  className='px-3 py-4 rounded-lg text-xl'
                  to='/shop/soapandpowder'
                  onClick={closeMobileMenu}
                >
                  {' '}
                  Soap & Powder{' '}
                </Link>
                <Link
                  className='px-3 py-4 rounded-lg text-xl'
                  to='/shop/gift'
                  onClick={closeMobileMenu}
                >
                  {' '}
                  Gifts{' '}
                </Link>
                <Link
                  className='px-3 py-4 rounded-lg text-xl'
                  to='/shop/gold'
                  onClick={closeMobileMenu}
                >
                  {' '}
                  Gold{' '}
                </Link>
                {user ? (
                  <>
                    <Link to='/'>
                      <button className='px-3 py-4 rounded-lg text-xl'>
                        {' '}
                        Logout{' '}
                      </button>
                    </Link>
                    <Link
                      className='px-3 py-4 rounded-lg text-xl'
                      to='/account'
                      onClick={closeMobileMenu}
                    >
                      {' '}
                      Account{' '}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      className='px-3 py-4 rounded-lg text-xl'
                      to='/login'
                      onClick={closeMobileMenu}
                    >
                      {' '}
                      Login{' '}
                    </Link>
                    <Link
                      className='px-3 py-4 rounded-lg text-xl'
                      to='/signup'
                      onClick={closeMobileMenu}
                    >
                      {' '}
                      Register{' '}
                    </Link>
                  </>
                )}
                {user ? (
                  <Link
                    className='px-3 py-4 rounded-lg text-xl'
                    to='/admin'
                    onClick={closeMobileMenu}
                  >
                    {' '}
                    Admin{' '}
                  </Link>
                ) : null}
              </div>

              <div className='lg:hidden flex items-center justify-between fixed bottom-0 text-gray-700 body-font bg-white w-full h-14 sm:h-16 px-6 md:px-8 pb-3'>
                <button
                  className='flex flex-col items-center justify-center flex-shrink-0 outline-none focus:outline-none'
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <HiMenuAlt1 />
                </button>
                <Link to='/' onClick={closeMobileMenu}>
                  {' '}
                  <HiOutlineHome />{' '}
                </Link>
                <div className='relative block'>
                  <Link to='/checkout' onClick={closeMobileMenu}>
                    <HiOutlineShoppingCart />
                    {cart.length > 0 && (
                      <span className='absolute -right-2 -bottom-3 text-red-500 text-base font-medium'>
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
