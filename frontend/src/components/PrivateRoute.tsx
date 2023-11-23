import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserAppState } from '../types/UserType';

const PrivateRoute = () => {
  const { userInfo } = useSelector((state: UserAppState) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoute;
