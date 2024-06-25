import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../slices/authSlice'
import { useLogoutMutation } from '../slices/usersApiSlice'
import { resetCart } from '../slices/cartSlice'
import {
  HiMenuAlt1,
  HiOutlineHome,
  HiOutlineShoppingCart,
} from 'react-icons/hi'
import { MdOutlineAccountCircle } from 'react-icons/md'
import logoblack from '../logoblack.png'
import logowhite from '../logowhite.png'
import { Link, useNavigate } from 'react-router-dom'
import { CartAppState } from '../types/CartType'
import { toast } from 'react-toastify'
import { UserAppState } from '../types/UserType'
import SearchBox from './SearchBox'
import { useLocation } from 'react-router-dom'

const Navigation = () => {
  const { cartItems } = useSelector((state: CartAppState) => state.cart)
  const { userInfo } = useSelector((state: UserAppState) => state.auth)
  const [isAtTop, setIsAtTop] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false)
  const location = useLocation()
  const isMainPage = location.pathname === '/'
  const isAdmin = location.pathname.startsWith('/admin')
  const isAdminProductList = location.pathname.startsWith('/admin/productlist')

  const logoSrc = isAtTop ? logowhite : logoblack
  const fixedLogoClasses = `${logoSrc}`
  const navbarClasses = isAtTop ? 'text-white' : 'bg-white text-black'
  const fixedNavbarClasses = `lg:fixed md:fixed z-20 w-screen px-4 transition duration-200 ease-in-out sm:h-18 md:px-8 lg:px-2.5 ${navbarClasses}`
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    // Only apply scroll logic on the main page
    if (isMainPage) {
      const handleScroll = () => {
        setIsAtTop(window.scrollY === 0)
      }

      window.addEventListener('scroll', handleScroll)
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    } else {
      // For other pages, always set isAtTop to false
      setIsAtTop(false)
    }
  }, [isMainPage])

  const closeMobileMenu = () => {
    setMenuOpen(false)
  }

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [logoutApiCall] = useLogoutMutation()

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap()
      dispatch(logout())
      dispatch(resetCart())
      navigate('/')
      toast.success('Logout successful')
    } catch (error: any) {
      console.log(error)
    }
  }

  return (
    <nav className='lg:absolute md:absolute z-20 h-26 lg:h-20 overflow-hidden'>
      <div className={fixedNavbarClasses}>
        <div className='flex items-center justify-center max-w-screen w-full h-full xl:justify-between'>
          <Link to='/'>
            {' '}
            <img
              className='hidden max-h-24 lg:max-h-16 lg:inline-flex focus:outline-none lg:pr-10 md:max-h-16 md:inline-flex md:pr-10 md:mt-2 '
              alt='Logo'
              src={fixedLogoClasses}
            />{' '}
          </Link>

          {/* //desktop menu */}
          {!isAdminProductList ? (
            <div className='lg:flex uppercase md:flex md:px-6 hidden text-center items-center'>
              <Link
                className='hidden xl:flex px-3 py-2 rounded-lg hover:bg-white/20 hover:text-lg'
                to='/category/perfume'
              >
                {' '}
                Perfume{' '}
              </Link>
              <Link
                className='hidden xl:flex px-3 py-2 rounded-lg hover:bg-white/20 hover:text-lg'
                to='/category/miniature'
              >
                {' '}
                Miniature{' '}
              </Link>


              {/* Dropdown Toggle Button */}
              <button
                className='lg:flex xl:hidden text-center items-center px-3 py-2 rounded-lg hover:bg-white/20'
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Categories
              </button>

              {/* Dropdown Links */}
              {isDropdownOpen && (
                <div className='md:flex absolute top-16 bg-white/25 rounded-lg flex-col text-center items-center xl:hidden'>
                  <Link
                    className='px-3 py-2 rounded-lg hover:bg-white/20 hover:text-lg'
                    to='/category/perfume'
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Perfume
                  </Link>
                  <Link
                    className='px-3 py-2 rounded-lg hover:bg-white/20 hover:text-lg'
                    to='/category/miniature'
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Miniature
                  </Link>


                </div>
              )}
            </div>
          ) : (
            <div>
              <h1 className='text-2xl'>Admin Panel Productlist</h1>
            </div>
          )}
          <div className='lg:flex md:flex sm:hidden ltr:md:ml-6 rtl:md:mr- ltr:xl:ml-10 rtl:xl:mr-10 lg:py-7'>
            {!isAdminProductList && (
              <div className='lg:flex sm:hidden hidden md:px-16 text-center items-center rounded-xl px-3]\'>
                <SearchBox isAdmin={isAdmin} />
              </div>
            )}
            {userInfo ? (
              <>
                <Link to='/'>
                  <button
                    className='hidden md:flex px-3 py-2'
                    onClick={logoutHandler}
                  >
                    Logout
                  </button>
                </Link>
                <Link
                  className='hidden md:flex px-3 py-2 text-2xl text-center'
                  to='/account'
                >
                  <MdOutlineAccountCircle />
                </Link>

                {userInfo.isAdmin && (
                  <div
                    onMouseEnter={() => setAdminDropdownOpen(true)}
                    onMouseLeave={() => setAdminDropdownOpen(false)}
                    className='relative'
                  >
                    <button
                      className='hidden md:flex px-3 py-2 rounded-lg hover:bg-white/20'
                      onClick={() => setAdminDropdownOpen(true)}
                    >
                      Admin
                    </button>
                    {adminDropdownOpen && (
                      <div className='absolute right-0  w-48 bg-white/25 shadow-lg rounded-lg py-1 z-20'>
                        <Link
                          className='block px-4 py-2 text-sm hover:bg-gray-100/50 w-full'
                          to='/admin/productlist'
                        >
                          Products
                        </Link>
                        <Link
                          className='block px-4 py-2 text-sm hover:bg-gray-100/50'
                          to='/admin/orderlist'
                        >
                          Orders
                        </Link>
                        <Link
                          className='block px-4 py-2 text-sm hover:bg-gray-100/50'
                          to='/admin/userlist'
                        >
                          Users
                        </Link>
                        <Link
                          className='block px-4 py-2 text-sm hover:bg-gray-100/50'
                          to='/admin/dashboard'
                        >
                          Dashboard
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>

              </>
            )}


          </div>

          {/* //mobile menu */}
          <div className='lg:hidden md:hidden fixed z-10 bottom-0 flex items-center justify-between text-gray-700 body-font bg-white w-full h-14 sm:h-16 px-6 md:px-8 pb-3'>
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

            </div>
          </div>

          {/* //mobile menu Open */}
          {menuOpen && (
            <div className='flex lg:hidden md:hidden fixed z-10 top-0 w-full h-full bg-white text-black justify-center items-center'>
              <div className='flex flex-col text-center '>
                <Link
                  className='px-3 py-4 rounded-lg text-xl'
                  to='/category/perfume'
                  onClick={closeMobileMenu}
                >
                  {' '}
                  Perfume{' '}
                </Link>
                <Link
                  className='px-3 py-4 rounded-lg text-xl'
                  to='/category/miniature'
                  onClick={closeMobileMenu}
                >
                  {' '}
                  Miniature{' '}
                </Link>


                {userInfo ? (
                  <>
                    <Link to='/'>
                      <button
                        className='px-3 py-4 rounded-lg text-xl'
                        onClick={logoutHandler}
                      >
                        {' '}
                        Logout{' '}
                      </button>
                    </Link>
                    <Link
                      className='px-3 py-4 rounded-lg text-xl'
                      to='/profile'
                      onClick={closeMobileMenu}
                    >
                      {' '}
                      Account{' '}
                    </Link>
                  </>
                ) : (
                  <>

                  </>
                )}
                {userInfo?.isAdmin ? (
                  <>
                    <Link
                      className='px-3 py-4 rounded-lg text-xl'
                      to='/admin/dashboard'
                      onClick={closeMobileMenu}
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      className='px-3 py-4 rounded-lg text-xl'
                      to='/admin/productlist'
                      onClick={closeMobileMenu}
                    >
                      Admin Products list
                    </Link>
                    <Link
                      className='px-3 py-4 rounded-lg text-xl'
                      to='/admin/orderlist'
                      onClick={closeMobileMenu}
                    >
                      Admin Orders list
                    </Link>
                    <Link
                      className='px-3 py-4 rounded-lg text-xl'
                      to='/admin/userlist'
                      onClick={closeMobileMenu}
                    >
                      Admin Users list
                    </Link>
                  </>
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

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
