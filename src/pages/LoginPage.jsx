import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', { email });
      console.log('Login API URL:', axios.defaults.baseURL + '/api/users/login');
      
      const response = await axios.post('/api/users/login', formData);
      console.log('Login successful, response:', response.data);
      
      login(response.data);
      
      if (response.data.userType === 'admin') {
        navigate('/admin');
      } else if (response.data.userType === 'merchant') {
        navigate('/merchant');
      } else {
        navigate('/');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        setError(error.response.data.message || 'Invalid email or password');
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('Server not responding. Please try again later.');
      } else {
        console.error('Error message:', error.message);
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="auth-logo">
          <h3>Market Express</h3>
          <p>Department of Agriculture E-commerce Platform</p>
        </div>
        
        <h2>Welcome Back</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="register-link">
          Don't have an account? <Link to="/register">Sign up here</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 