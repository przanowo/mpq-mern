import { IoLogoInstagram } from 'react-icons/io5';
import { FaFacebook } from 'react-icons/fa';
import { IoLogoYoutube } from 'react-icons/io';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <footer className='flex-shrink-0 border-b-4 border-heading mt-9 md:mt-11 lg:mt-16 3xl:mt-20 pt-2.5 lg:pt-0 2xl:pt-2 items-end bg-white/75'>
        <div className='mx-auto max-w-[1920px] px-4 md:pb-1 lg:pt-6 2xl:pb-8 items-end'>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-9 xl:gap-5 pb-9 md:pb-14 lg:pb-6 2xl:pb-6 3xl:pb-16 lg:mb-0.5 2xl:mb-0 3xl:-mb-1 xl:grid-cols-6 '>
            <div className='pb-1 md:pb-0 undefined'>
              <h4 className='mb-5 text-sm font-semibold text-heading md:text-base xl:text-lg 2xl:mb-6 3xl:mb-7'>
                Social
              </h4>
              <ul className='text-xs lg:text-sm text-body flex flex-col space-y-3 lg:space-y-3.5'>
                <li className='flex items-baseline'>
                  <span className='ltr:mr-3 rtl:ml-3 relative top-0.5 lg:top-1 text-sm lg:text-base'>
                    <IoLogoInstagram />
                  </span>
                  <div>Instagram</div>
                </li>
                <li className='flex items-baseline'>
                  <span className='ltr:mr-3 rtl:ml-3 relative top-0.5 lg:top-1 text-sm lg:text-base'>
                    <FaFacebook />
                  </span>
                  <div>Facebook</div>
                </li>
                <li className='flex items-baseline'>
                  <span className='ltr:mr-3 rtl:ml-3 relative top-0.5 lg:top-1 text-sm lg:text-base'>
                    <IoLogoYoutube />
                  </span>
                  <div>Youtube</div>
                </li>
                {/* <li className="flex items-baseline">
                            <span className='ltr:mr-3 rtl:ml-3 relative top-0.5 lg:top-1 text-sm lg:text-base'><AiFillTwitterCircle/></span> 
                            <Link to='www.Instagram.com'>Twitter</Link>
                        </li> */}
              </ul>
            </div>

            <div className='pb-3 md:pb-0 undefined'>
              <h4 className='mb-5 text-sm font-semibold text-heading md:text-base xl:text-lg 2xl:mb-6 3xl:mb-7'>
                Contact
              </h4>
              <ul className='text-xs lg:text-sm text-body flex flex-col space-y-3 lg:space-y-3.5'>
                <li className='flex items-baseline'>
                  <div>Contact</div>
                </li>
                <li className='flex items-baseline'>
                  <p>yourexample@email.com</p>
                </li>
                <li className='flex items-baseline'>
                  <p>+1 234 567 89 00</p>
                </li>
              </ul>
            </div>

            <div className='pb-3 md:pb-0 undefined'>
              <h4 className='mb-5 text-sm font-semibold text-heading md:text-base xl:text-lg 2xl:mb-6 3xl:mb-7'>
                About
              </h4>
              <ul className='text-xs lg:text-sm text-body flex flex-col space-y-3 lg:space-y-3.5'>
                <li className='flex items-baseline'>
                  <div>About Us</div>
                </li>
                <li className='flex items-baseline'>
                  <div>Support</div>
                </li>
                {/* <li className="flex items-baseline">
                            <Link to='/about'>Copyright</Link>
                        </li> */}
              </ul>
            </div>

            <div className='pb-3 md:pb-0 undefined'>
              <h4 className='mb-5 text-sm font-semibold text-heading md:text-base xl:text-lg 2xl:mb-6 3xl:mb-7'>
                FAQ
              </h4>
              <ul className='text-xs lg:text-sm text-body flex flex-col space-y-3 lg:space-y-3.5'>
                <li className='flex items-baseline'>
                  <div>FAQ & Help</div>
                </li>
                <li className='flex items-baseline'>
                  <div>Shipping & Delivery</div>
                </li>
                <li className='flex items-baseline'>
                  <div>Return & Exchanges</div>
                </li>
              </ul>
            </div>

            <div className='pb-3 md:pb-0 undefined'>
              <h4 className='mb-5 text-sm font-semibold text-heading md:text-base xl:text-lg 2xl:mb-6 3xl:mb-7'>
                Our Information
              </h4>
              <ul className='text-xs lg:text-sm text-body flex flex-col space-y-3 lg:space-y-3.5'>
                <li className='flex items-baseline'>
                  <div>Privacy policy</div>
                </li>
                <li className='flex items-baseline'>
                  <div>Terms & conditions</div>
                </li>
              </ul>
            </div>

            <div className='pb-3 md:pb-0 undefined'>
              <h4 className='mb-5 text-sm font-semibold text-heading md:text-base xl:text-lg 2xl:mb-6 3xl:mb-7'>
                Connected Shops
              </h4>
              <ul className='text-xs lg:text-sm text-body flex flex-col space-y-3 lg:space-y-3.5'>
                <li className='flex items-baseline'>
                  <div>Ebay</div>
                </li>
                <li className='flex items-baseline'>
                  <div>Etsy</div>
                </li>
                <li className='flex items-baseline'>
                  <div>Amazon</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className='text-sm text-black p-2 text-center'>
          &copy; {currentYear} Mini Parfum Queen. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Footer;
