import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Provider } from 'react-redux';
import store from './store';
import Home from './pages/Home';
import ProductScreen from './pages/ProductScreen';
import CartScreen from './pages/CartScreen';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ShippingPage from './pages/ShippingPage';
import PrivateRoute from './components/PrivateRoute';
import Payment from './pages/Payment';
import PlaceOrder from './pages/PlaceOrder';
import OrderPage from './pages/OrderPage';
import ProfilePage from './pages/ProfilePage';
import AdminRoute from './pages/admin/OrderScreen';
import OrderScreen from './pages/admin/OrderScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} element={<Home />} />
      <Route path='/product/:productId' element={<ProductScreen />} />
      <Route path='/cart' element={<CartScreen />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Signup />} />

      <Route path='' element={<PrivateRoute />}>
        <Route path='/shipping' element={<ShippingPage />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/placeorder' element={<PlaceOrder />} />
        <Route path='/order/:orderId' element={<OrderPage />} />
        <Route path='/profile' element={<ProfilePage />} />
      </Route>

      <Route path='' element={<AdminRoute />}>
        <Route path='/admin/orderlist' element={<OrderScreen />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const initialOptions = {
  clientId:
    'AXjDkPvwnL9xF6rSDnKpf40fI9w6CucYHwZZEPtHRsnc1WHgx9NQCNpT3wpgruno6mrSmuv17jWlVsjW',
  currency: 'USD',
};

console.log(initialOptions, 'initialOptions');

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider options={initialOptions}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
