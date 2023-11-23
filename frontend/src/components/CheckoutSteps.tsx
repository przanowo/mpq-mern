import { Link } from 'react-router-dom';

type CheckoutStepsProps = {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
};

const CheckoutSteps = ({ step1, step2, step3, step4 }: CheckoutStepsProps) => {
  return (
    <div className='flex'>
      <div>
        {step1 ? (
          <div className='flex'>
            <Link to='/login'>Sign In</Link>
          </div>
        ) : (
          <div className='flex'>
            <Link to='#' className='cursor-not-allowed'>
              Sign In
            </Link>
          </div>
        )}
      </div>

      <div>
        {step2 ? (
          <div className='flex'>
            <Link to='/shipping'>Shipping</Link>
          </div>
        ) : (
          <div className='flex'>
            <Link to='#' className='cursor-not-allowed'>
              Shipping
            </Link>
          </div>
        )}
      </div>

      <div>
        {step3 ? (
          <div className='flex'>
            <Link to='/payment'>Payment</Link>
          </div>
        ) : (
          <div className='flex'>
            <Link to='#' className='cursor-not-allowed'>
              Payment
            </Link>
          </div>
        )}
      </div>

      <div>
        {step4 ? (
          <div className='flex'>
            <Link to='/placeorder'>Place Order</Link>
          </div>
        ) : (
          <div className='flex'>
            <Link to='#' className='cursor-not-allowed'>
              Place Order
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutSteps;
