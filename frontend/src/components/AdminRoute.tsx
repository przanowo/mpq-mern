import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserAppState } from '../types/UserType';

const AdminRoute = () => {
  const { userInfo } = useSelector((state: UserAppState) => state.auth);
  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to='/login' replace />
  );
};

export default AdminRoute;
