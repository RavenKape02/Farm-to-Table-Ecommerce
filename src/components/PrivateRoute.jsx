import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Spinner from './Spinner';


const PrivateRoute = ({ adminOnly = false, merchantOnly = false }) => {
  const { isAuthenticated, isAdmin, isMerchant, loading, userInfo } = useContext(AuthContext);
  const location = useLocation();
  
  useEffect(() => {
    console.log('PrivateRoute rendered with:', { 
      isAuthenticated, 
      isAdmin,
      isMerchant,
      loading,
      adminOnly,
      merchantOnly,
      userEmail: userInfo?.email,
      userType: userInfo?.userType
    });
  }, [isAuthenticated, isAdmin, isMerchant, loading, adminOnly, merchantOnly, userInfo]);
  
  if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
    console.log('PrivateRoute: User already authenticated, redirecting to home page');
    return <Navigate to="/" replace />;
  }
  
  if (!isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
    console.log('PrivateRoute: User not authenticated, allowing access to login/register');
    return <Outlet />;
  }
  
  if (loading) {
    console.log('PrivateRoute: Still loading authentication state');
    return <Spinner text="Authenticating..." />;
  }
  
  if (!isAuthenticated) {
    console.log('PrivateRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && !isAdmin) {
    console.log('PrivateRoute: User not admin, redirecting to home page');
    return <Navigate to="/" replace />;
  }
  
  console.log('PrivateRoute: Rendering protected content');
  return <Outlet />;
};

export default PrivateRoute; 