import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(savedUserInfo);
        setUserInfo(parsedUserInfo);
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUserInfo.token}`;
        if (parsedUserInfo._id) {
          fetchCartCount(parsedUserInfo._id);
        }
      } catch (error) {
        console.error('Error parsing saved user info:', error);
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  const fetchCartCount = async (userId) => {
    try {
      const { data } = await axios.get(`/api/cart/user/${userId}`);
      const count = data.items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    } catch (err) {
      console.error('Error fetching cart count:', err);
      setCartCount(0);
    }
  };

  const login = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUserInfo(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    if (userData._id) {
      fetchCartCount(userData._id);
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    delete axios.defaults.headers.common['Authorization'];
    setCartCount(0);
  };

  const contextValue = {
    userInfo,
    loading,
    login,
    logout,
    isAuthenticated: !!userInfo,
    isAdmin: userInfo?.userType === 'admin',
    isMerchant: userInfo?.userType === 'merchant',
    cartCount,
    setCartCount,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
