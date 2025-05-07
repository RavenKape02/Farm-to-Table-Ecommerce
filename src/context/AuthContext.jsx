import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for saved user info on component mount
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    console.log('Initial auth check - Saved user info:', savedUserInfo ? 'Found' : 'Not found');
    
    if (savedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(savedUserInfo);
        console.log('Setting user info from localStorage:', parsedUserInfo.email);
        setUserInfo(parsedUserInfo);
        
        // Set default axios auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUserInfo.token}`;
      } catch (error) {
        console.error('Error parsing saved user info:', error);
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  // Login
  const login = (userData) => {
    console.log('Login function called with user data:', userData.email);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUserInfo(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  };

  // Logout
  const logout = () => {
    console.log('Logout function called');
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const contextValue = {
    userInfo,
    loading,
    login,
    logout,
    isAuthenticated: !!userInfo,
    isAdmin: userInfo?.userType === 'admin',
    isMerchant: userInfo?.userType === 'merchant'
  };

  console.log('Auth context state:', { 
    isAuthenticated: !!userInfo,
    isAdmin: userInfo?.userType === 'admin',
    isMerchant: userInfo?.userType === 'merchant',
    userType: userInfo?.userType,
    loading 
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 